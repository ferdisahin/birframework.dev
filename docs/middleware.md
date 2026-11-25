# HTTP Middleware Pipeline

Middleware provides a convenient mechanism for inspecting and filtering HTTP requests entering your application.

---

## What is Middleware?

Middleware functions wrap incoming requests in an onion-style pipeline. Common use cases include:
- Verifying authentication tokens or session cookies
- Enforcing rate limiting
- Verifying CSRF tokens on state-changing requests
- Logging request durations and response statuses

---

## Defining Custom Middleware

Create a middleware class or function implementing the `Middleware` signature:

```ts
// app/middleware/Authenticate.ts
import type { Context, NextFunction } from 'birframework';

export async function Authenticate(ctx: Context, next: NextFunction) {
  const token = ctx.req.headers['authorization'];

  if (!token) {
    return ctx.unauthorized({ error: 'Authentication token required' });
  }

  // Continue to the next middleware or controller
  await next();
}
```

---

## Applying Middleware

### 1. Global Middleware
Applied to every incoming request:

```ts
// app.ts
import { app } from './bootstrap.ts';
import { RequestLogger } from './app/middleware/RequestLogger.ts';

app.use(RequestLogger);
```

### 2. Route-Level Middleware
Attached to specific routes or route groups:

```ts
import { Route } from 'birframework';
import { Authenticate } from './app/middleware/Authenticate.ts';

Route.get('/dashboard', (ctx) => {
  return ctx.render('dashboard');
}).middleware(Authenticate);

Route.group({ prefix: '/admin', middleware: [Authenticate] }, () => {
  Route.get('/settings', (ctx) => ctx.render('admin/settings'));
});
```


## Response Compression (`compress`)

Compress JSON, HTML, CSS, and JS responses automatically with Brotli (`br`) or Gzip (`gzip`), while safely skipping `HEAD`, `204`/`206`/`304`, SSE (`text/event-stream`), and binary media (`audio/*`, `video/*`, `image/*`):

```ts
import { compress } from 'birframework';

app.use(compress({ threshold: 1024, brotli: true, gzip: true }));
```

## Media Streaming (`Range 206`), `ETag`, & `ctx.fileStream()`

`serveStatic()` supports `Accept-Ranges: bytes`, `206 Partial Content` / `416 Range Not Satisfiable`, and `ETag` / `304 Not Modified` out of the box for audio, video, and resumable downloads.

For authenticated or dynamic file streaming inside a controller, use `ctx.fileStream()`:

```ts
Route.get('/stream/:trackId', async (ctx) => {
  // Check auth/subscription here...
  await ctx.fileStream(`storage/tracks/${ctx.params.trackId}.mp3`);
});
```
