# high-care (monorepo)

This workspace contains the `frontend` React/Vite application and, as of
March 2026, the API code has been consolidated into `frontend/api` so the
entire project can be deployed as a single Vercel project.

The old `backend/` folder is left intact for reference but is no longer used
by the build system; the server.js it contained has been moved into
`frontend/api/server.js` and exported as an Express app suitable for use as a
Vercel serverless function.

See `frontend/README.md` for more detailed instructions.
