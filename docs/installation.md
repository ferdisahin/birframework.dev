# Installation Guide

Get up and running with BirFramework in seconds using the official interactive CLI scaffolder.

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

> **Port Auto-Increment**: If port `3000` is already in use by another service on your machine, BirFramework automatically detects `EADDRINUSE` and gracefully switches to the next available port (`3001`, `3002`, etc.) without crashing.

---

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `npx tsx watch app.ts` | Starts the development server with Hot Reload and Live Reload |
| `npm start` | `node dist/app.js` | Boots the compiled production server |
| `npm run build` | `tsc` | Compiles TypeScript source to `dist/` |
