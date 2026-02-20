# Invoice & Estimate Template App — Project Guide

## What This App Does

A web-based invoicing and estimation tool for service businesses (construction, cleaning, painting, pest control). Users select an industry template, fill in company and client information directly on a document preview, and print/download as a PDF.

**Core features:**
- Industry-specific templates (construction active; others coming soon)
- Two document types: Estimates and Invoices
- Inline Google Docs-style editing on the document
- Company logo upload
- Print-to-PDF via browser print dialog
- Document management with search (saved to localStorage)
- Move to Trash / restore / delete forever (soft delete)
- Bilingual template support (English/Spanish)

---

## Tech Stack

| Tool | Version | Role |
|---|---|---|
| **Next.js** | 16+ | React framework — file-based routing, SSR, SEO |
| **React** | 19 | UI library |
| **Tailwind CSS** | 4 | Utility-first styling (sole CSS approach) |
| **Firebase** | 12 | Planned: auth + Firestore cloud storage (not yet wired up) |
| **localStorage** | — | Current client-side persistence layer |

**Languages:** JSX (JavaScript), CSS (globals.css only), HTML (managed by Next.js), JSON

---

## Project Structure

```
invoice-template-app/
├── app/                        ← Next.js App Router
│   ├── layout.jsx              ← Root layout — wraps all pages, imports globals.css
│   ├── page.jsx                ← / → redirects to /home
│   ├── home/
│   │   └── page.jsx            ← Document list + search
│   ├── templates/
│   │   ├── page.jsx            ← Industry selection
│   │   └── [industry]/
│   │       └── page.jsx        ← Templates for a specific industry
│   ├── editor/
│   │   └── [docId]/
│   │       └── page.jsx        ← Main editing interface
│   └── trash/
│       └── page.jsx            ← Recently deleted (restore / delete forever)
├── src/
│   ├── components/
│   │   └── EstimateLayout.jsx  ← Reusable estimate layout component
│   └── data/
│       ├── docsStore.js        ← Document CRUD + soft delete + localStorage persistence
│       └── templates.js        ← Template definitions (industries, types, defaults)
├── globals.css                 ← Tailwind import + print styles + lined-textarea class
├── next.config.js
├── postcss.config.js
└── package.json
```

---

## Routing (Next.js App Router)

| URL | File | Description |
|---|---|---|
| `/` | `app/page.jsx` | Redirects to `/home` |
| `/home` | `app/home/page.jsx` | Document list |
| `/templates` | `app/templates/page.jsx` | Industry picker |
| `/templates/construction` | `app/templates/[industry]/page.jsx` | Templates for industry |
| `/editor/abc123` | `app/editor/[docId]/page.jsx` | Edit a document |
| `/trash` | `app/trash/page.jsx` | Recently deleted |

Dynamic segments use `useParams()` from `next/navigation`.

---

## Architecture

### Client Components
All pages use `useState`, `useEffect`, and event handlers → all are marked `'use client'`. This is a Next.js requirement for interactive components.

### State Management
No Redux or Context API. Each page manages its own state via `useState`. Document changes call `updateDoc()` from `docsStore.js`, which writes to localStorage and returns the updated doc.

### localStorage + Hydration Pattern
Pages that read from localStorage use `useState([])` (empty initial state matching server render) + `useEffect` to load data on the client after mount. This prevents Next.js hydration mismatches.

### Data Flow (EditorPage)
```
doc (useState) → patch functions → updateDoc() → localStorage → setDoc(updated)
```

### Soft Delete
Documents are never immediately destroyed. `softDeleteDoc()` stamps a `deletedAt` timestamp. `listDocs()` filters these out. The `/trash` page shows them via `listDeletedDocs()` with options to `restoreDoc()` or permanently `deleteDoc()`.

### CSS Strategy
- **Tailwind CSS only** — all styling via utility classes in JSX
- **globals.css** — Tailwind import + print media queries + `.lined-textarea` custom class
- No CSS Modules anywhere

### Print / PDF
- `window.print()` triggers the browser print dialog
- Print styles in `globals.css` hide the toolbar (`.no-print`), set `Letter` page size, preserve colors (`print-color-adjust: exact`), and make inputs transparent

---

## Development Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Next.js ESLint
```

---

## React Concepts Used in This Project

This project is **good for React learning**. It covers:

| Concept | Where |
|---|---|
| `useState` | Every page — doc state, search query, form fields |
| `useEffect` | HomePage, TrashPage — load localStorage data after mount (hydration pattern); EditorPage — load doc |
| `useRef` | EditorPage — file input ref for logo upload |
| `useMemo` | EditorPage — computed totals from line items |
| `useRouter()` | All pages — programmatic navigation |
| `useParams()` | IndustryTemplatesPage, EditorPage — URL dynamic segments |
| Conditional rendering | EditorPage — estimate vs invoice layout |
| List rendering (`.map()`) | HomePage cards, TemplatesPage, line items table |
| Event handling | onChange, onClick, onKeyDown, onInput everywhere |
| File API / FileReader | Logo upload in EditorPage |
| `'use client'` directive | All interactive pages (Next.js concept) |

**Not yet covered (good next steps):** Context API, custom hooks, React Query / SWR, testing (React Testing Library), server components with data fetching, Firebase integration.

---

## Known TODOs / Planned Work

- **Firebase integration** — Auth + Firestore for cloud sync and user accounts (already installed, not wired up)
- **Invoice layout upgrade** — Proposal-style box header + client block + line items table
- **More industry templates** — House Cleaning, Painting, Pest Control (currently "Coming soon")
- **SEO** — Add metadata to each page via Next.js `generateMetadata`
- **Ad integration** — Google AdSense or similar once public-facing
- **Auto-empty trash** — Permanently delete items after 30 days

---

## Data Model

```js
Document {
  id, industry, templateId, language, docType,  // "estimate" | "invoice"
  title, status,
  meta: { estimateNumber, invoiceNumber, issueDate, dueDate, pageNo, pageCount },
  company: { name, phone, email, logoDataUrl, license },
  client: { name, phone, email, address },
  job: { address, description },
  lineItems: [{ id, name, qty, rate }],
  pricing: { totalCost },
  description, notes, terms,
  createdAt, lastEditedAt,
  deletedAt  // set by softDeleteDoc(); undefined on active docs
}
```
