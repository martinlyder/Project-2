# Modeltester (Project-2)

A small Angular app for trying out and comparing text-generation models via a simple web UI and serverless API routes.

## Table of contents

* [Features](#features)
* [Tech stack](#tech-stack)
* [Getting started](#getting-started)
* [Configuration](#configuration)
* [Project structure](#project-structure)
* [Scripts](#scripts)
* [Developing locally](#developing-locally)
* [Deployment](#deployment)
* [License](#license)

## Features

* Minimal UI to send prompts to one or more text models and view responses side‑by‑side.
* Simple serverless endpoints (in `/api`) to keep API keys off the client and enable provider/model switching in one place.
* Angular 18 + Vite build for fast local dev and production output.
* Ready for one‑click deploys on Vercel (includes `vercel.json`).

> Note: This repo is intentionally lightweight to make it easy to fork and adapt for your own providers/models.

## Tech stack

* **Framework**: Angular (v18+) with the Vite builder
* **Language**: TypeScript
* **Styling**: CSS
* **Serverless**: Vercel Functions (Node runtime) in `/api`
* **Build/Deploy**: Vercel

## Getting started

### Prerequisites

* Node.js 18+ and npm (or pnpm/yarn)

### 1) Clone and install

```bash
git clone https://github.com/martinlyder/Project-2.git
cd Project-2
npm install
```

### 2) Configure environment

Create a `.env` file at the project root (or use Vercel project environment variables) and add any provider keys your API routes need, for example:

```
# examples — rename/remove based on the providers you use
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
```

> Check the files in `/api` for the exact variable names used. Keep keys **out of the browser**; send requests via the serverless routes.

### 3) Run the dev server

```bash
# whichever you prefer — both work if Angular CLI is installed
npm start           # or
npx ng serve
```

The app will start on `http://localhost:4200` (or the port Angular chooses) and hot‑reload on changes.

## Configuration

* **Providers & models**: Add or edit API routes in `/api` to point at the providers/models you want to test. Export lean handlers that accept `{ prompt, system, params }` and return the model’s text.
* **UI variants**: If you want to compare multiple models at once, consider adding a small configuration object (e.g., in `src/app/...`) mapping buttons/dropdowns to API route names.
* **Rate limits**: Add minimal debouncing on the input field and handle 429 responses in the client to avoid provider throttling.

## Project structure

```
Project-2/
├─ api/                # Vercel serverless functions (model proxy routes)
├─ src/                # Angular application code
├─ angular.json        # Angular workspace config (Vite builder)
├─ vercel.json         # Vercel project settings
├─ package.json        # Scripts & deps
└─ LICENSE             # MIT
```

## Scripts

Common scripts (exact names may vary — see `package.json`):

* `npm start` — run the dev server
* `npm run build` — production build
* `npm test` — run tests (if/when added)

## Developing locally

* Prefer adding new providers behind `/api/*` endpoints to keep secrets server‑side.
* Create a simple provider wrapper to normalize request/response shapes so the UI can remain provider‑agnostic.
* For debugging, log structured events (provider, model, latency, tokens) in dev only; never log secrets.

## Deployment

This repo is set up for Vercel. Typical flow:

1. Push to `main` (or open a PR) — Vercel will create a preview build.
2. Add your environment variables in the Vercel dashboard (Project → Settings → Environment Variables).
3. Promote a preview to production or merge to trigger a production deploy.

If you deploy elsewhere, serve the `/dist` build output from any static host and route `/api/*` to your Node serverless/express handlers.

## License

MIT — see [LICENSE](LICENSE).
