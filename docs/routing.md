# Routing & Parameters

BirJS features an intuitive, expressive router inspired by Laravel, engineered for sub-millisecond route dispatching.

---

## Basic Route Definition

Define routes in `routes/web.ts` (for HTML views) or `routes/api.ts` (for REST endpoints):

```ts
import { Route, auth } from 'birframework';

// Basic GET route returning JSON
Route.get('/ping', (ctx) => {
  return ctx.json({ status: 'pong', time: Date.now() });
});

// Basic POST route
Route.post('/contact', async (ctx) => {
  const body = await ctx.body();
  return ctx.json({ success: true, message: 'Message received' });
});
```

---

## Route Parameters

Capture dynamic parameters in URLs using the `:param` syntax:

```ts
// Mandatory route parameter
Route.get('/users/:id', async (ctx) => {
  const userId = ctx.params.id;
  return ctx.json({ id: userId });
});

// Multiple parameters
Route.get('/posts/:slug/comments/:commentId', (ctx) => {
  const { slug, commentId } = ctx.params;
  return ctx.json({ slug, commentId });
});
```

---

## Named Routes

Name routes for identification in route listings and application tooling:

```ts
Route.get('/users/profile', (ctx) => {
  return ctx.render('profile');
}).name('user.profile');

// Use the registered URL when linking to this route.
```

---

## Route Groups & Prefixes

Organize related endpoints with route prefixes and shared middleware:

```ts
Route.group({ prefix: '/api/v1', middleware: [auth()] }, () => {
  Route.get('/me', (ctx) => ctx.json(ctx.user));
  Route.get('/orders', (ctx) => ctx.json([]));
});
```

---

## HTTP Verbs Supported

| Method | Helper Method | Example |
| --- | --- | --- |
| `GET` | `Route.get(path, handler)` | Fetch data or render page |
| `POST` | `Route.post(path, handler)` | Create new resource |
| `PUT` | `Route.put(path, handler)` | Replace existing resource |
| `PATCH` | `Route.patch(path, handler)` | Partially update resource |
| `DELETE` | `Route.delete(path, handler)` | Remove resource |
