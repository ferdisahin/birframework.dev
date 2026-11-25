# AI Assistant Rules & Cursor Guide

> **Give this guide to any AI assistant (Cursor, Claude, Copilot, ChatGPT, Antigravity) to immediately enable 100% accurate, idiomatic BirFramework code generation.**

BirFramework is built with strict architectural patterns (ActiveRecord ORM, Preact + Inertia SSR, Laravel-like DX in TypeScript). When working with AI coding tools, providing explicit framework rules prevents hallucinations and ensures the model writes idiomatic controllers, models, and migrations without spaghetti code.

---

## Quick Setup & Downloads

You can provide BirFramework knowledge to your AI tools using any of the following methods:

| File / Standard | Purpose | Direct Link |
| :--- | :--- | :--- |
| **`.cursorrules`** | For **Cursor IDE** or Windsurf — place in your project root | [Download .cursorrules](/.cursorrules) |
| **`BIRFRAMEWORK_RULES.md`** | Complete manual for **Claude Projects**, **ChatGPT**, or custom agents | [Download Markdown](/BIRFRAMEWORK_RULES.md) |
| **`/llms.txt`** | Standard machine-readable AI documentation index | [View /llms.txt](/llms.txt) |
| **`/llms-full.txt`** | Full consolidated documentation for context injection | [View /llms-full.txt](/llms-full.txt) |

---

## How to Configure Your AI Tool

### 1. Cursor IDE & Windsurf
Save the rule set as `.cursorrules` in your project's root directory:
```bash
curl -o .cursorrules https://birjs.com/.cursorrules
```
Cursor will automatically index these rules and apply them to every prompt, inline edit (Cmd+K), and composer chat (Cmd+I).

### 2. Claude Projects & Anthropic Workbench
1. Create a new Project in Claude.
2. In the **Project Knowledge** section, upload [`BIRFRAMEWORK_RULES.md`](/BIRFRAMEWORK_RULES.md).
3. In the **Custom Instructions** field, paste:
   ```text
   You are an expert BirFramework developer. Always adhere to the BirFramework conventions in the attached project knowledge. Use proper MVC architecture, ActiveRecord models, and Preact Inertia SSR. Never write spaghetti route closures.
   ```

### 3. Custom GPTs & ChatGPT
Attach `BIRFRAMEWORK_RULES.md` to your Custom GPT's Knowledge files, and instruct it to always follow BirFramework conventions for any TypeScript / Node.js web development questions.

---

## Master AI Rules & Architecture Manual

Below is the complete text of the BirFramework AI Rules:

```markdown
# BirFramework AI Rules & Architecture Manual

> **System Instruction for AI Assistants (Cursor, Claude, Copilot, ChatGPT, Antigravity):**
> You are an elite software architect and senior full-stack TypeScript engineer specializing in **BirFramework** (BirJS). When writing or refactoring code for any BirFramework application, you MUST adhere strictly to the conventions, rules, file structures, and code patterns outlined in this document.

---

## 1. Executive Summary & Philosophy

**BirFramework** is a modern, high-performance full-stack TypeScript web framework for Node.js inspired by Laravel's elegance and developer ergonomics, coupled with the speed of **Preact + Inertia.js + SSR**, **Vite**, and zero-config deployment to **Vercel** or standard Node.js servers.

### Core Tenets
1. **Batteries-Included MVC**: Strict separation of concerns via Models (`app/models/`), Controllers (`app/controllers/`), Middleware (`app/middleware/`), and Routes (`routes/web.ts`).
2. **Never Write Spaghetti Routes**: Route files MUST ONLY declare routes and bind them to Controller actions. NEVER write large inline closures or direct database queries in `routes/web.ts`.
3. **Use Built-in Framework Primitives**: Always use BirFramework's native `Schema`, `Blueprint`, `Model` (ActiveRecord ORM), `Hash`, `sessionMiddleware`, `ctx.validate`, and `ctx.inertia`. NEVER invent custom workarounds or import low-level drivers like `node:sqlite` directly when framework abstractions exist.
4. **Preact over React**: Frontend views use **Preact** (`preact/hooks`) for ultra-light client bundles and instant hydration with Inertia SSR. Never import `'react'` unless an external library strictly requires it.
5. **Persistent Layouts**: Always wrap page components with `Page.layout` for seamless, unmounting-free client-side page transitions and state persistence.

---

## 2. Directory Structure Conventions

A standard BirFramework application follows this canonical layout:

```text
my-bir-app/
├── api/
│   └── index.ts                 # Vercel Serverless Function entry point
├── app/
│   ├── controllers/             # HTTP Controllers (e.g., AuthController.ts, DashboardController.ts)
│   ├── models/                  # ActiveRecord Models (e.g., User.ts, Post.ts, Component.ts)
│   ├── middleware/              # Route & HTTP Middleware (e.g., requireAuth.ts, resolveLocale.ts)
│   ├── providers/               # Service Providers & Plugins
│   └── jobs/                    # Asynchronous Queue Jobs
├── database/
│   ├── migrations/              # Database Schema Migrations
│   ├── seeders/                 # Database Seeders
│   └── factories/               # Model Factories
├── routes/
│   ├── web.ts                   # Web & Inertia Routes
│   └── api.ts                   # Stateless JSON API Routes
├── views/
│   ├── layouts/                 # Preact Layout Components (e.g., AppLayout.tsx, DocsLayout.tsx)
│   ├── pages/                   # Inertia Page Components rendered via ctx.inertia()
│   └── components/              # Reusable UI Components
├── resources/
│   ├── css/
│   │   └── app.css              # Tailwind CSS v4 Entry
│   └── js/
│       └── app.tsx              # Inertia Client Hydration Entry
├── storage/
│   ├── database.sqlite          # Default SQLite database (if file-based)
│   ├── logs/                    # Application and Pail logs
│   └── sessions/                # File-based session store
├── public/                      # Static assets served directly (images, robots.txt, etc.)
├── app.ts                       # Local development & production Node.js server entry point
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vercel.json                  # Serverless deployment configuration
└── vite.config.js               # Vite asset bundling & SSR build configuration
```

---

## 3. Server Initialization (`app.ts` & `api/index.ts`)

### Local & Node.js Production Entry (`app.ts`)

```typescript
import {
  Application,
  logger,
  compress,
  serveStatic,
  Inertia,
  sessionMiddleware,
  setSessionStore,
  FileSessionStore
} from 'birframework';
import './routes/web.js';

const app = new Application();

// 1. Performance: Compression for responses > 512 bytes
app.use(compress({ threshold: 512 }));

// 2. Static Asset Delivery: Serves public/ directly
app.use(serveStatic({ publicDir: 'public' }));

// 3. Sessions: FileSessionStore or DatabaseSessionStore
setSessionStore(new FileSessionStore({ path: './storage/sessions' }));
app.use(sessionMiddleware({
  cookieName: 'bir_session',
  maxAge: 86400 * 7, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}));

// 4. Inertia Middleware: Handles X-Inertia requests & SSR
app.use(Inertia.middleware());

// 5. Logging: Structured CLI logging
if (process.env.NODE_ENV !== 'production') {
  app.use(logger());
}

// 6. Server Listen: Automatic port conflict resolution
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', (port) => {
  console.log(`BirFramework running at http://localhost:${port || PORT}`);
});
```

### Vercel Serverless Entry (`api/index.ts`)

```typescript
import {
  Application,
  compress,
  serveStatic,
  Inertia,
  sessionMiddleware,
  setSessionStore,
  FileSessionStore
} from 'birframework';
import '../routes/web.js';

const app = new Application();
app.use(compress({ threshold: 512 }));
app.use(serveStatic({ publicDir: 'public' }));
setSessionStore(new FileSessionStore({ path: '/tmp/sessions' }));
app.use(sessionMiddleware());
app.use(Inertia.middleware());

export default app.serverless();
```

---

## 4. Routing (`routes/web.ts`)

Routes are registered using the global `Route` facade (or `router`).

```typescript
import { Route } from 'birframework';
import { HomeController } from '../app/controllers/HomeController.js';
import { AuthController } from '../app/controllers/AuthController.js';
import { AdminController } from '../app/controllers/AdminController.js';
import { requireAuth } from '../app/middleware/requireAuth.js';
import { resolveLocale } from '../app/middleware/resolveLocale.js';

const home = new HomeController();
const auth = new AuthController();
const admin = new AdminController();

// Global middleware on route groups
Route.group({ middleware: [resolveLocale] }, () => {
  // Public Routes
  Route.get('/', (ctx) => home.index(ctx)).name('home');
  Route.get('/login', (ctx) => auth.showLogin(ctx)).name('login');
  Route.post('/login', (ctx) => auth.login(ctx));
  Route.post('/logout', (ctx) => auth.logout(ctx)).name('logout');

  // Media Streaming (Audio/Video with HTTP 206 Range)
  Route.get('/stream/audio/:file', (ctx) => home.streamAudio(ctx)).name('audio.stream');

  // Protected Admin Routes with Prefix & Middleware
  Route.group({ prefix: '/admin', middleware: [requireAuth] }, () => {
    Route.get('/', (ctx) => admin.dashboard(ctx)).name('admin.dashboard');
    Route.post('/items', (ctx) => admin.createItem(ctx)).name('admin.items.create');
    Route.put('/items/:id', (ctx) => admin.updateItem(ctx)).name('admin.items.update');
    Route.delete('/items/:id', (ctx) => admin.deleteItem(ctx)).name('admin.items.delete');
  });
});
```

---

## 5. HTTP Context (`HttpContext`) Reference

Every controller action and route handler receives an instance of `HttpContext` (`ctx`):

| Property / Method | Description | Example |
| :--- | :--- | :--- |
| `ctx.req` | Raw Node.js `IncomingMessage` | `ctx.req.headers['user-agent']` |
| `ctx.res` | Raw Node.js `ServerResponse` | `ctx.res.setHeader('X-Custom', 'val')` |
| `ctx.params` | Named route parameters | `ctx.params.id` from `/users/:id` |
| `ctx.query` | Parsed URL query parameters | `ctx.query.page`, `ctx.query.filter` |
| `ctx.body` | Parsed JSON or URL-encoded body | `const { email, password } = ctx.body;` |
| `ctx.session` | Session manager instance | `ctx.session.get('user_id')`, `ctx.session.set('user_id', 1)` |
| `ctx.json(data, status = 200)` | Responds with JSON | `return ctx.json({ success: true }, 201);` |
| `ctx.html(string, status = 200)` | Responds with raw HTML | `return ctx.html('<h1>Hello</h1>');` |
| `ctx.redirect(url, status = 302)`| Redirects to given URL | `return ctx.redirect('/admin');` |
| `ctx.fileStream(filePath, opts)` | Streams file with HTTP 206 Range support | `return ctx.fileStream('/path/to/song.mp3');` |
| `ctx.inertia(component, props, meta)` | Renders Inertia/Preact SSR page | `return ctx.inertia('Dashboard', { user }, { title: 'Dashboard' });` |
| `ctx.validate(rules)` | Validates request body with rules | `const data = await ctx.validate({ email: 'required|email' });` |

---

## 6. Controllers (`app/controllers/`)

Controllers group related HTTP actions into dedicated classes. Always instantiate controllers or call methods cleanly.

```typescript
import { HttpContext, Hash } from 'birframework';
import { User } from '../models/User.js';
import { Incident } from '../models/Incident.js';

export class AdminController {
  async dashboard(ctx: HttpContext) {
    const user = await User.find(ctx.session.get('user_id'));
    const incidents = await Incident.orderBy('created_at', 'desc').limit(50).get();

    return ctx.inertia('Admin/Dashboard', {
      user: { id: user.id, name: user.name, email: user.email },
      incidents,
      flash: {
        success: ctx.session.getFlash('success'),
        error: ctx.session.getFlash('error'),
      },
    }, {
      title: 'Admin Dashboard — BirJS',
    });
  }

  async createIncident(ctx: HttpContext) {
    const data = await ctx.validate({
      title_en: 'required|string|max:255',
      title_tr: 'required|string|max:255',
      impact: 'required|in:minor,major,critical',
      message_en: 'required|string',
      message_tr: 'required|string',
    });

    await Incident.create(data);

    ctx.session.flash('success', 'Incident created successfully');
    return ctx.redirect('/admin');
  }
}
```

---

## 7. Database, Schema & Models (ActiveRecord ORM)

BirFramework includes a robust multi-driver ActiveRecord ORM supporting SQLite, PostgreSQL, and MySQL.

### Defining a Schema Migration (`database/migrations/`)

Use `Schema.create(tableName, (table: Blueprint) => { ... })`:

```typescript
import { Schema, Blueprint } from 'birframework';

export async function up() {
  await Schema.create('components', (table: Blueprint) => {
    table.id();                                  // Auto-increment primary key 'id'
    table.string('name_en', 100);
    table.string('name_tr', 100);
    table.string('status', 30).default('operational');
    table.integer('sort_order').default(0);
    table.timestamps();                          // created_at & updated_at
  });

  await Schema.create('incidents', (table: Blueprint) => {
    table.id();
    table.string('title_en', 255);
    table.string('title_tr', 255);
    table.string('impact', 30).default('minor');
    table.string('status', 30).default('investigating');
    table.integer('component_id').nullable();
    table.text('message_en');
    table.text('message_tr');
    table.timestamps();
  });
}

export async function down() {
  await Schema.dropIfExists('incidents');
  await Schema.dropIfExists('components');
}
```

#### Blueprint Column Types:
- `table.id()` — Primary key integer auto-increment
- `table.string(name, length = 255)` — VARCHAR / TEXT
- `table.text(name)` — TEXT
- `table.integer(name)` — INTEGER
- `table.float(name)` — REAL / FLOAT
- `table.boolean(name)` — BOOLEAN (0 or 1 in SQLite)
- `table.json(name)` — JSON text
- `table.timestamps()` — `created_at` and `updated_at` ISO strings

#### Column Modifiers:
- `.nullable()`
- `.unique()`
- `.default(value)`

---

### Defining an ActiveRecord Model (`app/models/`)

Every model extends `Model` and declares `static table` and `static fillable`:

```typescript
import { Model } from 'birframework';
import { DailyUptime } from './DailyUptime.js';

export class Component extends Model {
  public static override table = 'components';
  public static override primaryKey = 'id';
  public static override timestamps = true;

  // IMPORTANT: Only fields listed in fillable can be mass-assigned via create() or update()
  public static override fillable = [
    'name_en',
    'name_tr',
    'status',
    'sort_order',
  ];

  uptimes() {
    return this.hasMany(DailyUptime, 'component_id');
  }
}
```

### Model Query & Persistence Operations

```typescript
// 1. Fetching Records
const allComponents = await Component.all();
const single = await Component.find(1);
const active = await Component.where('status', 'operational').first();
const sorted = await Component.orderBy('sort_order', 'asc').limit(10).get();

// 2. Creating Records
// Model.create automatically executes INSERT and returns the hydrated instance with .id populated!
const component = await Component.create({
  name_en: 'API Gateway',
  name_tr: 'API Ağ Geçidi',
  status: 'operational',
  sort_order: 1,
});
console.log(component.id); // Valid number ID!

// 3. Updating Records
component.status = 'degraded_performance';
await component.save();

// Or mass update:
await component.update({ status: 'major_outage' });

// 4. Deleting Records
await component.delete();
```

---

## 8. Authentication & Password Hashing

### Password Hashing (`Hash`)
```typescript
import { Hash } from 'birframework';

// Hash a plaintext password (returns 'scrypt:salt:hash')
const hashedPassword = await Hash.make('secret123');

// Verify a plaintext password against the hash
const isValid = await Hash.check('secret123', hashedPassword); // returns boolean
```

### Sessions (`sessionMiddleware` & `setSessionStore`)

> **CRITICAL RULE**: The session middleware is exported as **`sessionMiddleware()`**, NOT `session()`.

```typescript
import { sessionMiddleware, setSessionStore, FileSessionStore } from 'birframework';

// In app.ts:
setSessionStore(new FileSessionStore({ path: './storage/sessions' }));
app.use(sessionMiddleware({
  cookieName: 'bir_session',
  maxAge: 86400 * 7,
}));

// In Controllers:
ctx.session.set('user_id', user.id);
const userId = ctx.session.get('user_id');
ctx.session.flash('success', 'Logged in successfully!');
ctx.session.destroy();
```

---

## 9. Frontend Architecture: Preact + Inertia + SSR

### Persistent Layout Pattern (`Page.layout`)

```tsx
// views/pages/StatusPage.tsx
import { AppLayout } from '../layouts/AppLayout';
import { Head } from '../../resources/js/bir-inertia';

export default function StatusPage({ components }: { components: any[] }) {
  return (
    <div>
      <Head title="System Status" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">System Status</h1>
      </div>
    </div>
  );
}

// Persistent Layout definition:
StatusPage.layout = (page: any) => <AppLayout>{page}</AppLayout>;
```

---

## 10. Golden Rules & Negative Constraints for AI

1. ❌ **NEVER write monolithic `routes/web.ts` files**: Route files must only wire URLs to Controller actions. Keep business logic strictly in Controllers and Models.
2. ❌ **NEVER import `node:sqlite` directly**: Always use `Schema.create(...)`, `Blueprint`, and `Model` classes.
3. ❌ **NEVER import `{ session }`**: The export is `sessionMiddleware()` and `setSessionStore()`.
4. ❌ **NEVER import from `'react'` in page components**: Use Preact (`preact/hooks`) or framework-provided inertia wrappers.
5. ❌ **NEVER forget `static fillable` on Models**: Mass assignment using `Model.create(...)` drops attributes not declared in `static fillable`.
6. ❌ **NEVER emit flash or reload state in SSR that causes hydration mismatch**: Defer browser-only reads (like `localStorage`) to `useEffect()`.
7. ✅ **ALWAYS implement persistent layouts**: Set `Page.layout = (page) => <Layout>{page}</Layout>` so navigation remains smooth without flicker.
8. ✅ **ALWAYS return `ctx.json(...)`, `ctx.redirect(...)`, or `ctx.inertia(...)`** from Controller actions.
```
