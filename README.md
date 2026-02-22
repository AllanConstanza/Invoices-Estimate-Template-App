# JustWrite

Professional estimates and invoices for contractors and service businesses. No spreadsheets. No complexity.

## Features

- Industry-specific templates — Construction, House Cleaning, Painting, Pest Control
- Two document types per industry: **Estimate** and **Invoice**
- Inline Google Docs-style editing directly on the document
- Add / remove line items dynamically
- Company logo upload
- Print to PDF via browser print dialog
- Document list with search
- Move to Trash / restore / delete forever (soft delete)
- Bilingual template support (English / Spanish)
- Firebase Auth — email/password and Google sign-in
- Firestore cloud sync — documents persist across devices and browsers

## Tech Stack

| Tool | Role |
|---|---|
| **Next.js** (App Router) | Framework — routing, SSR, file-based pages |
| **React 19** | UI |
| **Tailwind CSS v4** | Styling |
| **Firebase Auth** | User authentication |
| **Firestore** | Cloud document storage |
| **localStorage** | Offline cache |

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Firebase

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → Sign-in methods → **Email/Password** + **Google**
3. Enable **Firestore Database** (start in test mode)
4. In Project Settings → Your apps → Web app → copy the config object

### 3. Add environment variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.local.example .env.local
```

### 4. Run the dev server

```bash
npm run dev       # localhost:3000
```

```bash
npm run build     # production build
npm run start     # serve production build
```

## Project Structure

```
app/
  page.jsx              → landing page
  login/                → sign in / sign up
  home/                 → document list
  templates/            → industry picker
  templates/[industry]/ → templates for a specific industry
  editor/[docId]/       → document editor
  trash/                → recently deleted

src/
  lib/
    firebase.js         → Firebase app init (auth + db)
  context/
    AuthContext.jsx     → global auth state (useAuth hook)
  components/
    Navbar.jsx          → top nav, auth-aware
    AuthGuard.jsx       → redirects unauthenticated users to /login
  data/
    docsStore.js        → document CRUD, localStorage cache, Firestore sync
    templates.js        → template definitions for all 8 templates
```

