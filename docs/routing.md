# Routing & Parameters

BirFramework features an intuitive, expressive router inspired by Laravel, engineered for sub-millisecond route dispatching.

---

## Basic Route Definition

Define routes in `routes/web.ts` (for HTML views) or `routes/api.ts` (for REST endpoints):

```ts
import { Route } from 'birframework';

// Basic GET route returning JSON
Route.get('/ping', (ctx) => {
  return ctx.json({ status: 'pong', time: Date.now() });
});

// Basic POST route
Route.post('/contact', async (ctx) => {
  const body = ctx.body;
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

Name your routes to generate URLs dynamically throughout your application:

```ts
Route.get('/users/profile', (ctx) => {
  return ctx.render('profile');
}).name('user.profile');

// Resolving named URL elsewhere:
const url = Route.url('user.profile'); // => "/users/profile"
```

---

## Route Groups & Prefixes

Organize related endpoints with route prefixes and shared middleware:

```ts
Route.group({ prefix: '/api/v1', middleware: ['auth'] }, () => {
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
