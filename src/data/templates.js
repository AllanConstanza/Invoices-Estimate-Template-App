// src/data/templates.js
export const INDUSTRIES = [
  { slug: "construction", name: "Construction" },
  { slug: "house-cleaning", name: "House Cleaning" },
  { slug: "painting", name: "Painting" },
  { slug: "pest-control", name: "Pest Control" },
];

export const TEMPLATES = [
  // -------------------------
  // CONSTRUCTION — ESTIMATE
  // -------------------------
  {
    id: "construction-estimate-v1",
    industry: "construction",
    docType: "estimate",
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

  // -------------------------
  // HOUSE CLEANING — ESTIMATE
  // -------------------------
  {
    id: "house-cleaning-estimate-v1",
    industry: "house-cleaning",
    docType: "estimate",
    name: { en: "House Cleaning — Estimate", es: "Limpieza del Hogar — Estimado" },
    description: {
      en: "Room-by-room cleaning estimate with flexible add-ons.",
      es: "Estimado de limpieza por habitación con opciones adicionales.",
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
        en: "Thank you for the opportunity. All products are eco-friendly unless otherwise requested.",
        es: "Gracias por la oportunidad. Todos los productos son ecológicos a menos que se solicite lo contrario.",
      },
      terms: {
        en: "This estimate is valid for 14 days. Cancellation requires 24 hours notice.",
        es: "Este estimado es válido por 14 días. La cancelación requiere aviso con 24 horas de anticipación.",
      },
      lineItems: [
        { name: { en: "Bedrooms", es: "Recámaras" }, qty: 1, rate: 0 },
        { name: { en: "Bathrooms", es: "Baños" }, qty: 1, rate: 0 },
        { name: { en: "Kitchen", es: "Cocina" }, qty: 1, rate: 0 },
        { name: { en: "Living Areas", es: "Áreas de sala" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // HOUSE CLEANING — INVOICE
  // -------------------------
  {
    id: "house-cleaning-invoice-v1",
    industry: "house-cleaning",
    docType: "invoice",
    name: { en: "House Cleaning — Invoice", es: "Limpieza del Hogar — Factura" },
    description: {
      en: "Cleaning service invoice with itemized rooms and add-ons.",
      es: "Factura de servicio de limpieza con habitaciones y servicios detallados.",
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
        en: "Thank you for your business!",
        es: "¡Gracias por su preferencia!",
      },
      terms: {
        en: "Payment due upon receipt. Accepted: cash, Zelle, Venmo.",
        es: "Pago al recibir. Aceptamos: efectivo, Zelle, Venmo.",
      },
      lineItems: [
        { name: { en: "Bedrooms", es: "Recámaras" }, qty: 1, rate: 0 },
        { name: { en: "Bathrooms", es: "Baños" }, qty: 1, rate: 0 },
        { name: { en: "Kitchen", es: "Cocina" }, qty: 1, rate: 0 },
        { name: { en: "Living Areas", es: "Áreas de sala" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // PAINTING — ESTIMATE
  // -------------------------
  {
    id: "painting-estimate-v1",
    industry: "painting",
    docType: "estimate",
    name: { en: "Painting — Estimate", es: "Pintura — Estimado" },
    description: {
      en: "Interior or exterior painting estimate with surface and material breakdown.",
      es: "Estimado de pintura interior o exterior con desglose de superficies y materiales.",
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
        en: "Thank you for the opportunity. Colors and finish to be confirmed before work begins.",
        es: "Gracias por la oportunidad. Colores y acabados se confirmarán antes de iniciar el trabajo.",
      },
      terms: {
        en: "This estimate is valid for 30 days. 50% deposit required to schedule.",
        es: "Este estimado es válido por 30 días. Se requiere 50% de depósito para agendar.",
      },
      lineItems: [
        { name: { en: "Surface Preparation", es: "Preparación de superficie" }, qty: 1, rate: 0 },
        { name: { en: "Primer", es: "Sellador" }, qty: 1, rate: 0 },
        { name: { en: "Paint — Walls", es: "Pintura — Paredes" }, qty: 1, rate: 0 },
        { name: { en: "Paint — Trim & Doors", es: "Pintura — Marcos y puertas" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // PAINTING — INVOICE
  // -------------------------
  {
    id: "painting-invoice-v1",
    industry: "painting",
    docType: "invoice",
    name: { en: "Painting — Invoice", es: "Pintura — Factura" },
    description: {
      en: "Final painting invoice with itemized labor and materials.",
      es: "Factura final de pintura con mano de obra y materiales detallados.",
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
        en: "Thank you for your business. Please inspect all painted surfaces before signing.",
        es: "Gracias por su preferencia. Favor de inspeccionar todas las superficies pintadas antes de firmar.",
      },
      terms: {
        en: "Payment due within 15 days. Late payments subject to a 1.5% monthly fee.",
        es: "Pago dentro de 15 días. Pagos atrasados sujetos a cargo mensual de 1.5%.",
      },
      lineItems: [
        { name: { en: "Surface Preparation", es: "Preparación de superficie" }, qty: 1, rate: 0 },
        { name: { en: "Primer", es: "Sellador" }, qty: 1, rate: 0 },
        { name: { en: "Paint — Walls", es: "Pintura — Paredes" }, qty: 1, rate: 0 },
        { name: { en: "Paint — Trim & Doors", es: "Pintura — Marcos y puertas" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // PEST CONTROL — ESTIMATE
  // -------------------------
  {
    id: "pest-control-estimate-v1",
    industry: "pest-control",
    docType: "estimate",
    name: { en: "Pest Control — Estimate", es: "Control de Plagas — Estimado" },
    description: {
      en: "Inspection + interior and exterior treatment estimate.",
      es: "Estimado de inspección + tratamiento interior y exterior.",
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
        en: "Thank you for the opportunity. Treatment type depends on pest species identified during inspection.",
        es: "Gracias por la oportunidad. El tipo de tratamiento depende de la especie identificada en la inspección.",
      },
      terms: {
        en: "This estimate is valid for 30 days. Results vary by infestation level.",
        es: "Este estimado es válido por 30 días. Los resultados varían según el nivel de infestación.",
      },
      lineItems: [
        { name: { en: "Initial Inspection", es: "Inspección inicial" }, qty: 1, rate: 0 },
        { name: { en: "Interior Treatment", es: "Tratamiento interior" }, qty: 1, rate: 0 },
        { name: { en: "Exterior Treatment", es: "Tratamiento exterior" }, qty: 1, rate: 0 },
        { name: { en: "Preventative Barrier", es: "Barrera preventiva" }, qty: 1, rate: 0 },
      ],
    },
  },

  // -------------------------
  // PEST CONTROL — INVOICE
  // -------------------------
  {
    id: "pest-control-invoice-v1",
    industry: "pest-control",
    docType: "invoice",
    name: { en: "Pest Control — Invoice", es: "Control de Plagas — Factura" },
    description: {
      en: "Service invoice for pest inspection and treatment.",
      es: "Factura de servicio de inspección y tratamiento de plagas.",
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
        en: "Thank you for your business. Follow-up visits included if pests return within 30 days.",
        es: "Gracias por su preferencia. Visitas de seguimiento incluidas si las plagas regresan en 30 días.",
      },
      terms: {
        en: "Payment due within 15 days of service.",
        es: "Pago vencido dentro de 15 días del servicio.",
      },
      lineItems: [
        { name: { en: "Initial Inspection", es: "Inspección inicial" }, qty: 1, rate: 0 },
        { name: { en: "Interior Treatment", es: "Tratamiento interior" }, qty: 1, rate: 0 },
        { name: { en: "Exterior Treatment", es: "Tratamiento exterior" }, qty: 1, rate: 0 },
        { name: { en: "Preventative Barrier", es: "Barrera preventiva" }, qty: 1, rate: 0 },
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
