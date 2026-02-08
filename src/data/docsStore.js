// Super simple in-memory store. Will later replace with Firestore.
const docs = new Map();

export function createDocFromTemplate({ industry, templateId, language = "en" }) {
  const id = crypto.randomUUID();

  const now = new Date().toISOString();

  const doc = {
    id,
    industry,
    templateId,
    language,
    status: "draft",
    title: defaultTitle(industry, templateId, language),
    createdAt: now,
    lastEditedAt: now,
    client: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    lineItems: [
      { id: crypto.randomUUID(), name: "Service item", qty: 1, rate: 100 },
    ],
    notes: defaultNotes(language),
    terms: defaultTerms(language),
  };

  docs.set(id, doc);
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
  return updated;
}

function defaultTitle(industry, templateId, language) {
  const industryLabel = industry.replaceAll("-", " ");
  if (language === "es") return `Estimado — ${capitalize(industryLabel)}`;
  return `Estimate — ${capitalize(industryLabel)}`;
}

function defaultNotes(language) {
  return language === "es"
    ? "Gracias por su preferencia."
    : "Thank you for your business.";
}

function defaultTerms(language) {
  return language === "es"
    ? "Pago debido dentro de 15 días."
    : "Payment due within 15 days.";
}

function capitalize(s) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
