// src/data/templates.js
export const INDUSTRIES = [
  { slug: "construction", name: "Construction" },
  { slug: "house-cleaning", name: "House Cleaning" },
  { slug: "painting", name: "Painting" },
  { slug: "pest-control", name: "Pest Control" },
];

// Only Construction is “real” right now.
// Later you add more templates here (data-only).
export const TEMPLATES = [
  // -------------------------
  // CONSTRUCTION — ESTIMATE
  // -------------------------
  {
    id: "construction-estimate-v1",
    industry: "construction",
    docType: "estimate", // "estimate" | "invoice"
    name: { en: "Construction — Estimate", es: "Construcción — Estimado" },
    description: {
      en: "Scope + line items + totals + terms (great for quotes).",
      es: "Alcance + partidas + totales + términos (ideal para cotizaciones).",
    },
    defaults: {
      title: { en: "Estimate", es: "Estimado" },
      show: {
        estimateNumber: true,
        invoiceNumber: false,
        issueDate: true,
        dueDate: false,
      },
      notes: {
        en: "Thank you for the opportunity. Please review the scope and let us know if you have any questions.",
        es: "Gracias por la oportunidad. Revise el alcance y avísenos si tiene alguna pregunta.",
      },
      terms: {
        en: "This estimate is valid for 30 days. Materials subject to availability and price changes.",
        es: "Este estimado es válido por 30 días. Materiales sujetos a disponibilidad y cambios de precio.",
      },
      lineItems: [
        { name: { en: "Labor", es: "Mano de obra" }, qty: 1, rate: 0 },
        { name: { en: "Materials", es: "Materiales" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // CONSTRUCTION — INVOICE
  // -------------------------
  {
    id: "construction-invoice-v1",
    industry: "construction",
    docType: "invoice",
    name: { en: "Construction — Invoice", es: "Construcción — Factura" },
    description: {
      en: "Invoice format with due date + payment terms.",
      es: "Formato de factura con fecha de vencimiento + términos de pago.",
    },
    defaults: {
      title: { en: "Invoice", es: "Factura" },
      show: {
        estimateNumber: false,
        invoiceNumber: true,
        issueDate: true,
        dueDate: true,
      },
      notes: {
        en: "Thank you for your business.",
        es: "Gracias por su preferencia.",
      },
      terms: {
        en: "Payment due within 15 days. Late payments may be subject to a fee.",
        es: "Pago debido dentro de 15 días. Pagos atrasados pueden estar sujetos a un cargo.",
      },
      lineItems: [
        { name: { en: "Labor", es: "Mano de obra" }, qty: 1, rate: 0 },
        { name: { en: "Materials", es: "Materiales" }, qty: 1, rate: 0 },
      ],
    },
  },
];

export function getTemplatesByIndustry(industry) {
  return TEMPLATES.filter((t) => t.industry === industry);
}

export function getTemplateById(templateId) {
  return TEMPLATES.find((t) => t.id === templateId) || null;
}
