# ResumeVance

An AI-powered resume reviewer that lets candidates upload a PDF, convert it to a high-quality preview, and receive ATS-focused feedback tailored to the job they are targeting. Authentication, storage, KV, and AI all run through the Puter platform, so users can sign in once and keep their analyses in one place.

## What it does

- Puter auth-backed experience with sign-in/sign-out and session checks handled in-app
- PDF upload via drag-and-drop, client-side size validation (max 5 MB), and single-file mode
- Automatic PDF → PNG conversion for a crisp preview using `pdfjs-dist`
- Storage of the original resume, generated preview image, and feedback in Puter FS/KV
- AI feedback (Claude Sonnet 4 via Puter AI) that scores ATS readiness and provides structured tips
- Resume review page with side-by-side preview and categorized insights (ATS, content, structure, tone, skills)

## Stack

- React Router v7 (SSR-ready) with TypeScript and TailwindCSS
- Puter SDK for auth, file storage, KV, and AI chat ([app/lib/puter.ts](app/lib/puter.ts))
- PDF rendering/conversion with `pdfjs-dist` ([app/lib/pdf2img.ts](app/lib/pdf2img.ts))
- State via Zustand, uploads with `react-dropzone`, utility styling via `clsx` + `tailwind-merge`

## How it works (flow)

1. User signs in with Puter at `/auth`, which initializes the session and redirects to the intended route.
2. On `/upload`, they enter role details and drop a PDF; we convert page 1 to PNG, upload both files to Puter FS, and stash metadata plus an empty feedback slot in KV.
3. We send the uploaded PDF to Puter AI with structured instructions ([constants/index.ts](constants/index.ts)) and store the JSON feedback back into KV under the same resume id.
4. The review page `/resume/:id` reads the stored assets, renders the preview, and surfaces ATS score, summary, and section-level tips.
5. The home dashboard lists prior analyses from KV and links back to each review.

## Getting started

### Prereqs

- Node 18+ (tested with modern LTS)
- A Puter account; the client SDK is injected at runtime via `https://js.puter.com/v2/` in [app/root.tsx](app/root.tsx)

### Install & run

```bash
npm install
npm run dev
# visit http://localhost:5173
```

### Build & serve

```bash
npm run build
npm run start   # serves build/server/index.js via react-router-serve
```

## Key scripts (package.json)

- `npm run dev` – React Router dev server with HMR
- `npm run build` – production build (client + server)
- `npm run start` – serve the built server output
- `npm run typecheck` – generate types and run `tsc`

## Notable UI surfaces

- Upload & analysis: [app/routes/upload.tsx](app/routes/upload.tsx)
- Resume review: [app/routes/resume.tsx](app/routes/resume.tsx)
- Auth gate: [app/routes/auth.tsx](app/routes/auth.tsx)
- Home dashboard: [app/routes/home.tsx](app/routes/home.tsx)

## Data & limits

- PDF uploads are limited to 5 MB and one file at a time ([app/components/FileUploader.tsx](app/components/FileUploader.tsx)).
- Only the first page is converted for preview during analysis.
- All storage, KV, and AI calls depend on the Puter runtime being available in the browser.

## Deployment

You can build and run with Docker or any Node host. Example Docker usage:

```bash
docker build -t resumevance .
docker run -p 3000:3000 resumevance
```

Serve the `build/` output (`build/client` + `build/server`) on your platform of choice.
