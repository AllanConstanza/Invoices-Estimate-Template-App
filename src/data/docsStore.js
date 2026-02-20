// src/data/docsStore.js
import { getTemplateById } from "./templates";

const STORAGE_KEY = "invoice_app_docs_v1";
const COUNTERS_KEY = "invoice_app_counters_v1";

// docs in memory
const docs = new Map(loadDocsFromStorage().map((d) => [d.id, d]));
const counters = loadCounters();

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

  const doc = {
    id,
    industry,
    templateId,
    language,
    docType, // "estimate" | "invoice"
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

    client: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },

    job: {
      address: "",
      description: "",
    },

    lineItems: (template.defaults.lineItems || []).map((li) => ({
      id: crypto.randomUUID(),
      name: li.name?.[language] ?? li.name?.en ?? "Item",
      qty: li.qty ?? 1,
      rate: li.rate ?? 0,
    })),

    notes: template.defaults.notes?.[language] ?? template.defaults.notes?.en ?? "",
    terms: template.defaults.terms?.[language] ?? template.defaults.terms?.en ?? "",
  };

  docs.set(id, doc);
  saveToStorage();
  return doc;
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
  const updated = { ...existing, deletedAt: new Date().toISOString(), lastEditedAt: new Date().toISOString() };
  docs.set(docId, updated);
  saveToStorage();
  return updated;
}

export function restoreDoc(docId) {
  const existing = docs.get(docId);
  if (!existing) return null;
  const { deletedAt, ...rest } = existing;
  const updated = { ...rest, lastEditedAt: new Date().toISOString() };
  docs.set(docId, updated);
  saveToStorage();
  return updated;
}

export function deleteDoc(docId) {
  docs.delete(docId);
  saveToStorage();
}

// ---------- storage helpers ----------
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(docs.values())));
  localStorage.setItem(COUNTERS_KEY, JSON.stringify(counters));
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
  // E-0001, I-0001
  const prefix = docType === "estimate" ? "E" : "I";
  const padded = String(counters[docType]).padStart(4, "0");
  saveToStorage();
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
