# Overview

BirJS is a TypeScript and Node.js web framework with HTTP routing, controllers, middleware, dependency injection, validation, database models, migrations, background jobs, scheduling, mail, and storage.

## Application flow

A route selects a handler. Middleware runs around that handler. Controllers read and validate the request, call application services or models, and return JSON, a redirect, or a rendered page.

## Rendering profiles

The Inertia profile uses Preact pages with server rendering and browser hydration. Its client Link and router helpers request page data without a full document navigation. The server-rendered profile returns TSX/JSX HTML through ctx.render.

## Database and services

SQLite uses Node's built-in node:sqlite. PostgreSQL and MySQL use optional pg and mysql2 packages. Queue workers and schedulers run as separate processes. Cache and session storage choices determine whether state is process-local or shared.

## Deployment

Run the application as a persistent Node.js process or export its serverless handler. Persistent processes retain in-memory state while running. Serverless instances can restart independently, so shared state requires suitable external storage.

Start with [Installation](/docs/installation), then read [Directory structure](/docs/directory-structure) and [Routing](/docs/routing).
