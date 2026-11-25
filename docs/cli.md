# CLI Command Reference

BirJS provides an artisan-style command-line tool `bir` for code generation, migrations, worker daemons, and project management.

---

## Project Scaffolding

```bash
# Interactive new project wizard
npx birframework new <project-name>

# Headless options
npx birframework new <project-name> --ts --tailwind
npx birframework new <project-name> --js --css
```

---

## Code Generators (`make:*`)

Generate boilerplate code following framework architectural patterns:

| Command | Description | Output Location |
| --- | --- | --- |
| `bir make:controller <Name>` | Creates a controller class | `app/controllers/<Name>.ts` |
| `bir make:model <Name>` | Creates an Active Record Model (`-m`, `-c`, `-r`, `-f`, `-s`, `--all`) | `app/models/<Name>.ts` |
| `bir make:component <Name> [-j]` | Creates a Blade or TSX component | `views/components/` |
| `bir make:view <Name> [--jsx]` | Creates a TSX or Blade view template | `views/` |
| `bir make:provider <Name>` | Creates a Service Provider | `app/providers/<Name>.ts` |
| `bir make:migration <Name>` | Creates a timestamped migration | `database/migrations/<timestamp>_<Name>.ts` |
| `bir make:middleware <Name>` | Creates a custom middleware | `app/middleware/<Name>.ts` |
| `bir make:job <Name>` | Creates an asynchronous queue job | `app/jobs/<Name>.ts` |
| `bir make:mail <Name>` | Creates a mailable email class | `app/mail/<Name>.ts` |
| `bir make:seeder <Name>` | Creates a database seeder class | `database/seeders/<Name>.ts` |
| `bir make:factory <Name>` | Creates a model factory with Faker | `database/factories/<Name>.ts` |
| `bir make:event <Name>` | Creates an event class | `app/events/<Name>.ts` |
| `bir make:listener <Name> [--event]` | Creates an event listener class | `app/listeners/<Name>.ts` |
| `bir make:request <Name>` | Creates a Form Request class | `app/requests/<Name>.ts` |
| `bir make:auth` | Scaffolds complete Breeze-style auth | Models, Controllers, Views, Migrations |
| `bir make:vercel` | Scaffolds zero-config Vercel Serverless deployment | `vercel.json`, `api/index.js` |

---

## Database & Migrations

```bash
# Run all outstanding migrations
bir migrate

# Roll back the most recent migration batch
bir migrate:rollback

# Drop all tables and re-run all migrations
bir migrate:fresh

# Seed the database with test records
bir db:seed
```

---

## Daemons & Development

```bash
# Start full-stack multi-process dev dashboard (Server, Queue, Logs, Vite)
bir dev

# Live real-time application log stream (tailing storage/logs/bir.log)
bir pail

# Start development server with hot-reload
bir serve

# Launch interactive REPL console with auto-loaded models
bir tinker

# Run automated test suites
bir test

# List all registered routes and handlers
bir route:list

# Start background queue processing worker
bir queue:work

# Inspect, retry, or flush failed background jobs
bir queue:failed
bir queue:retry all
bir queue:flush

# Put application into maintenance mode (503) or bring it back up
bir down --message="Upgrading database" --retry=60
bir up

# Generate a secure APP_KEY in .env (used by Crypt & SignedUrl)
bir key:generate

# Start task scheduler daemon
bir schedule:work

# Scaffold authentication controllers and views
bir make:auth

# Generate Vercel Serverless deployment config (vercel.json + api/index.js)
bir make:vercel
```

---

## Serverless & Deployment

New projects created with `npx birframework new` come pre-configured for Vercel Serverless. If you are upgrading an existing project or regenerating deployment files, run:

```bash
bir make:vercel
```

This generates:
- `vercel.json` — configures `npm run build --if-present`, `public` output directory, included static/docs bundles, and rewrites to `/api/index.js`.
- `api/index.js` — mounts `compress()`, `serveStatic({ publicDir: 'public' })`, `Inertia.middleware()`, and exports `app.serverless()`.

> `app.serverless()` also works on AWS Lambda and Netlify-compatible Node runtimes (additional platform generators such as Netlify are planned).
