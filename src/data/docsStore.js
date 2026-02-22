// src/data/docsStore.js
import { getTemplateById } from "./templates";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc as fsGetDoc,
  setDoc,
  deleteDoc as fsDeleteDoc,
} from "firebase/firestore";

const STORAGE_KEY = "invoice_app_docs_v1";
const COUNTERS_KEY = "invoice_app_counters_v1";

// In-memory cache — source of truth for all synchronous UI reads
const docs = new Map(loadDocsFromStorage().map((d) => [d.id, d]));
const counters = loadCounters();

// Current authenticated user UID (null when signed out)
let currentUid = null;

// ---------- Firestore init (called once per login) ----------
export async function initStore(uid) {
  currentUid = uid;
  try {
    // Load docs from Firestore
    const snap = await getDocs(collection(db, "users", uid, "docs"));
    docs.clear();
    snap.forEach((d) => docs.set(d.id, d.data()));

    // Load counters from Firestore
    const cSnap = await fsGetDoc(doc(db, "users", uid, "meta", "counters"));
    if (cSnap.exists()) {
      const data = cSnap.data();
      counters.estimate = Number(data.estimate) || counters.estimate;
      counters.invoice = Number(data.invoice) || counters.invoice;
    }

    // Mirror to localStorage as offline cache
    saveToStorage();
  } catch (err) {
    console.warn("Firestore load failed, falling back to localStorage:", err);
  }
}

// ---------- Background Firestore sync (fire-and-forget) ----------
function syncDocToFirestore(docId) {
  if (!currentUid) return;
  const data = docs.get(docId);
  if (data) {
    setDoc(doc(db, "users", currentUid, "docs", docId), data).catch(
      (e) => console.warn("Firestore write failed:", e)
    );
  } else {
    fsDeleteDoc(doc(db, "users", currentUid, "docs", docId)).catch(
      (e) => console.warn("Firestore delete failed:", e)
    );
  }
  // Sync counters alongside every write
  setDoc(doc(db, "users", currentUid, "meta", "counters"), counters).catch(
    (e) => console.warn("Firestore counters write failed:", e)
  );
}

// ---------- public API ----------
export function createDocFromTemplate({ industry, templateId, language = "en" }) {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`Template not found: ${templateId}`);

  const id = crypto.randomUUID();
  const now = new Date();
  const nowIso = now.toISOString();

  const docType = template.docType; // estimate | invoice
  const number = nextNumber(docType);

  const titleBase = template.defaults.title?.[language] ?? template.defaults.title?.en ?? "Document";

  const newDoc = {
    id,
    industry,
    templateId,
    language,
    docType,
    status: "draft",

    title: `${titleBase} #${number}`,

    meta: {
      estimateNumber: docType === "estimate" ? number : "",
      invoiceNumber: docType === "invoice" ? number : "",
      issueDate: toDateInputValue(now),
      dueDate: docType === "invoice" ? addDaysDateInput(now, 15) : "",
    },

    show: { ...template.defaults.show },

    createdAt: nowIso,
    lastEditedAt: nowIso,

    client: { name: "", phone: "", email: "", address: "" },
    job: { address: "", description: "" },

    lineItems: (template.defaults.lineItems || []).map((li) => ({
      id: crypto.randomUUID(),
      name: li.name?.[language] ?? li.name?.en ?? "Item",
      qty: li.qty ?? 1,
      rate: li.rate ?? 0,
    })),

    notes: template.defaults.notes?.[language] ?? template.defaults.notes?.en ?? "",
    terms: template.defaults.terms?.[language] ?? template.defaults.terms?.en ?? "",
  };

  docs.set(id, newDoc);
  saveToStorage();
  syncDocToFirestore(id);
  return newDoc;
}

export function getDoc(docId) {
  return docs.get(docId) || null;
}

export function updateDoc(docId, patch) {
  const existing = docs.get(docId);
  if (!existing) return null;

  const updated = {
    ...existing,
    ...patch,
    lastEditedAt: new Date().toISOString(),
  };

  docs.set(docId, updated);
  saveToStorage();
  syncDocToFirestore(docId);
  return updated;
}

export function listDocs() {
  return Array.from(docs.values())
    .filter((d) => !d.deletedAt)
    .sort((a, b) => new Date(b.lastEditedAt) - new Date(a.lastEditedAt));
}

export function listDeletedDocs() {
  return Array.from(docs.values())
    .filter((d) => Boolean(d.deletedAt))
    .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
}

export function softDeleteDoc(docId) {
  const existing = docs.get(docId);
  if (!existing) return null;
  const updated = {
    ...existing,
    deletedAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString(),
  };
  docs.set(docId, updated);
  saveToStorage();
  syncDocToFirestore(docId);
  return updated;
}

export function restoreDoc(docId) {
  const existing = docs.get(docId);
  if (!existing) return null;
  const { deletedAt, ...rest } = existing;
  const updated = { ...rest, lastEditedAt: new Date().toISOString() };
  docs.set(docId, updated);
  saveToStorage();
  syncDocToFirestore(docId);
  return updated;
}

export function deleteDoc(docId) {
  docs.delete(docId);
  saveToStorage();
  syncDocToFirestore(docId); // will delete from Firestore since doc is gone from Map
}

// ---------- storage helpers ----------
function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(docs.values())));
    localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
  } catch {
    // localStorage unavailable (SSR or private mode)
  }
}

function loadDocsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCounters() {
  try {
    const raw = localStorage.getItem(COUNTERS_KEY);
    if (!raw) return { estimate: 0, invoice: 0 };
    const parsed = JSON.parse(raw);
    return {
      estimate: Number(parsed.estimate) || 0,
      invoice: Number(parsed.invoice) || 0,
    };
  } catch {
    return { estimate: 0, invoice: 0 };
  }
}

function nextNumber(docType) {
  counters[docType] = (counters[docType] || 0) + 1;
  const prefix = docType === "estimate" ? "E" : "I";
  const padded = String(counters[docType]).padStart(4, "0");
  return `${prefix}-${padded}`;
}

function toDateInputValue(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysDateInput(dateObj, days) {
  const d = new Date(dateObj);
  d.setDate(d.getDate() + days);
  return toDateInputValue(d);
}
