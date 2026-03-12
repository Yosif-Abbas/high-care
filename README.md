# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Deployment and backend API

The repository now contains the React/Vite frontend and the Express API
at the project root. The server entrypoint is `api/server.js`, and the Vercel
build will package it automatically.

### Local development

- To run the frontend alone, simply use `npm run dev` in the project root.
  If the backend is running separately (e.g. an older copy on port 4000), set
  `VITE_API_BASE` in an `.env` file accordingly.
- To run both together use `npm run start` which executes `vercel dev` and
  proxies `/api/*` to `api/server.js`.

### Environment variables

- `VITE_API_BASE` is used by the React code and defaults to `""` in
  production (requests are made relative to the same origin). The example
  file is provided in `.env.example`.
- `GITHUB_TOKEN` – a personal access token with `repo` scope. **This is
  required in every environment** (development as well as production). The
  backend no longer reads or writes the disk; it always talks to GitHub.
  For local testing you can create a temporary token and set
  `GITHUB_REPOSITORY`/`GITHUB_BRANCH` accordingly. If you don’t want to use
  the API you must still supply a token (its value will be ignored) to
  prevent the server from erroring.
- `GITHUB_REPOSITORY` – the owner/repo slug (e.g. `Yosif-Abbas/high-care`).
- `GITHUB_BRANCH` – branch to commit to; defaults to `main`.

### Production on Vercel

1. Install the [Vercel CLI](https://vercel.com/download) and link the project
   (`vercel login && vercel`).
2. The `vercel.json` at the repository root tells the platform how to build
   the static front‑end and which directory contains the API routes.
3. Deploy with `vercel --prod`. The site will be available at a nicelooking
   URL and both frontend and `/api/*` routes share the same domain.

> ⚠️ **Important:** Vercel serverless functions have an _ephemeral_
> filesystem. Any writes to `content.json` or the contents of `public/` will **not be
> preserved** between invocations. The application now treats the repository
> as the CMS; it reads and writes `content.json` exclusively via GitHub's API.
> Images referenced by the CMS should live in `public/` so they are included in
> the static build. The API also exposes them at `/images/<filename>` by
> serving directly from `public/` to keep the old URLs working. Therefore
> **a valid `GITHUB_TOKEN` is mandatory in all environments**.
> If the token is missing the server will throw on every request that accesses
> content. This ensures you don’t accidentally rely on broken local I/O.
