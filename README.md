# Invoice & Estimate Template App

A web app for creating, editing, and printing professional invoices and estimates. Built for service businesses — construction, cleaning, painting, and more.

## Features

- Industry-specific templates (Construction active; others coming soon)
- Two document types: **Estimate** and **Invoice**
- Inline editing directly on the document — no separate form
- Print to PDF via browser print dialog
- Document list with search
- Move to Trash / restore / delete forever
- Bilingual template support (English / Spanish)
- Company logo upload

## Tech Stack

| Tool | Role |
|---|---|
| **Next.js** (App Router) | Framework — routing, SSR, file-based pages |
| **React 19** | UI |
| **Tailwind CSS v4** | Styling |
| **localStorage** | Document persistence (client-side) |
| **Firebase** | Planned — auth + cloud storage |

## Getting Started

```bash
npm install
npm run dev       # localhost:3000
```

```bash
npm run build     # production build
npm run start     # serve production build
```

## Project Structure

```
app/
  home/             → document list
  templates/        → industry picker
  templates/[industry]/  → templates for an industry
  editor/[docId]/   → edit a document
  trash/            → recently deleted

src/
  components/       → EstimateLayout (shared)
  data/
    docsStore.js    → CRUD + localStorage
    templates.js    → template definitions
```
