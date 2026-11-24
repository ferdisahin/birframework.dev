# Installation Guide

Get up and running with BirJS in seconds using the official interactive CLI scaffolder.

---

## System Requirements

Before creating your first project, ensure your environment satisfies the following prerequisites:

- **Node.js**: `v20.0.0` or higher (recommended: Node.js 22 LTS with native `node:sqlite`)
- **NPM**: `v9.0.0` or higher, or `pnpm` / `yarn`
- **Operating System**: macOS, Linux, or Windows (WSL recommended)

---

## Quickstart Scaffolding

Run `npx birframework new` directly in your terminal to bootstrap a fresh application:

```bash
npx birframework new my-bir-app
```

The interactive installer will prompt you for:
1. **Language Choice**: TypeScript (Strict) or Pure JavaScript (ESM)
2. **Styling Engine**: Tailwind CSS (Default) or Pure CSS

Alternatively, pass flags directly for headless CI/CD automation:

```bash
# TypeScript project with Tailwind CSS
npx birframework new my-app --ts --tailwind

# JavaScript project with Pure CSS
npx birframework new my-app --js --css
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
| `npm run dev:queue` | `npx bir queue:work` | Consumes async jobs and dispatches scheduled tasks |
| `npm run dev:logs` | `npx bir pail` | Streams real-time colorized logs directly in your terminal |
| `npm run dev:vite` | `vite` | Starts Vite HMR and auto-reload watcher for views and templates |
| `npm run build` | `vite build` | Compiles production assets to `public/build` with manifest |
| `npm start` | `npx tsx app.ts` | Boots the production application server |
