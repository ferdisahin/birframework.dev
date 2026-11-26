# Installation Guide

Get up and running with BirJS in seconds using the official interactive CLI scaffolder.

---

## System Requirements

Before creating your first project, ensure your environment satisfies the following prerequisites:

- **Node.js**: `v22.5.0` or higher
- **NPM**: `v9.0.0` or higher, or `pnpm` / `yarn`
- **Operating System**: macOS, Linux, or Windows (WSL recommended)

---

## Quickstart Scaffolding

Run `npx birframework new` directly in your terminal to bootstrap a fresh application:

```bash
npx birframework new my-bir-app
```

The interactive installer displays the recommended modern stack (**TypeScript (.ts/.tsx) + Tailwind CSS v4 + Unified Preact & Inertia + Vite**):
- Press **Enter** to install immediately with the recommended defaults.
- Or type **`c`** to customize Language (`TypeScript` / `JavaScript`), Styling (`Tailwind` / `Pure CSS`), or rendering profile (`Inertia` / `Server-rendered`).

Alternatively, pass flags directly for headless CI/CD automation:

```bash
# Default full-stack TypeScript + Tailwind v4 + Preact + Inertia + Vite
npx birframework new my-app --ts --tailwind --inertia

# Minimal MPA without Vite
npx birframework new my-app --ts --css --server-rendered
```

---

## Starting the Development Server

Navigate into your newly scaffolded application and launch the dev server:

```bash
cd my-bir-app
npm install
npm run dev
```

The application will start on `http://localhost:3000`.

> **Port Auto-Increment**: If port `3000` is already in use by another service on your machine, BirJS automatically detects `EADDRINUSE` and gracefully switches to the next available port (`3001`, `3002`, etc.) without crashing.

---

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `concurrently ...` | Boots the 4-service dev suite (`server`, `queue`, `logs`, `vite`) |
| `npm run dev:server` | `npx tsx watch app.ts` | Runs the core HTTP server with Hot Reload and auto port increment |
| `npm run dev:queue` | `npx bir queue:work` | Consumes asynchronous jobs (run scheduling separately with `bir schedule:work`) |
| `npm run dev:logs` | `npx bir pail` | Streams real-time colorized logs directly in your terminal |
| `npm run dev:vite` | `vite` | Starts Vite HMR and auto-reload watcher for views and templates |
| `npm run build` | `vite build` | Compiles production assets to `public/build` with manifest |
| `npm start` | `npx tsx app.ts` | Boots the production application server |

---

## Deploying to Vercel

Every project scaffolded with `npx birframework new` includes `vercel.json` and `api/index.js` out of the box, so you can deploy immediately by running `vercel` or pushing to GitHub.

If you need to add or regenerate Vercel Serverless configuration in an existing project, run:

```bash
npx bir make:vercel
```

This wires up `app.serverless()` with `compress()`, `serveStatic({ publicDir: 'public' })`, and `Inertia.middleware()`. Set a random `APP_KEY` in your Vercel Project Environment Variables for production deployments.
