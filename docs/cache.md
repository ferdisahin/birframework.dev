# Cache System

BirJS provides an expressive, unified API for various caching backends. Because Node.js runs in persistent V8 memory (unlike traditional PHP-FPM), in-memory caching operates at sub-microsecond latency out of the box with zero external infrastructure.

---

## Configuration & Drivers

BirJS supports two built-in cache drivers:

| Driver | Description | Persistence |
|---|---|---|
| `memory` | In-memory key-value store with TTL (Default) | In-process V8 RAM (Zero setup, sub-microsecond) |
| `file` | Serialized JSON files in `storage/cache/` | Survives server restarts |

Configure your default driver via `.env`:

```env
CACHE_STORE=memory
# or CACHE_STORE=file
```

---

## Basic Usage

Import the `Cache` facade:

```ts
import { Cache } from 'birframework';
```

### Storing Items

Store an item with an optional TTL in seconds (omit or pass `0` to keep forever):

```ts
// Store for 10 minutes (600 seconds)
await Cache.put('site_settings', { theme: 'dark', notifications: true }, 600);

// Store indefinitely
await Cache.put('app_version', '1.0.0');
```

### Retrieving Items

```ts
const settings = await Cache.get('site_settings');

// With fallback default value
const theme = await Cache.get('user_theme', 'light');
```

### Checking Existence

```ts
if (await Cache.has('site_settings')) {
  // Key exists and has not expired
}
```

---

## The `remember` Method

The crown jewel of caching ergonomics: retrieves an item from cache if it exists, or executes the callback, stores the result for the given TTL, and returns it.

```ts
import { Cache, Route, type Context } from 'birframework';
import { Post } from '../app/models/Post.js';

Route.get('/api/posts/popular', async (ctx: Context) => {
  const posts = await Cache.remember('popular_posts', 300, async () => {
    // Heavy database query only runs once every 5 minutes
    return await Post.where('views', '>', 1000)
      .orderBy('views', 'desc')
      .limit(10)
      .get();
  });

  return ctx.json(posts);
});
```

To remember an item forever:

```ts
const categories = await Cache.rememberForever('categories', async () => {
  return await Category.all();
});
```

---

## Atomic Counters & Pull

### Incrementing and Decrementing

```ts
// Increment by 1
await Cache.increment('page_views');

// Increment by custom amount
await Cache.increment('credits', 10);

// Decrement
await Cache.decrement('credits', 5);
```

### Pull (Retrieve & Delete)

Retrieve an item and immediately remove it from cache:

```ts
const token = await Cache.pull('one_time_token');
```

### Removing Items & Flushing

```ts
// Remove a single key
await Cache.forget('site_settings');

// Clear the entire cache
await Cache.flush();
```

---

## Multi-Store Switching

You can switch between different cache stores on the fly:

```ts
// Store in file cache (persisted across restarts)
await Cache.store('file').put('license_key', 'valid', 86400);

// Retrieve from in-memory cache
const memoryVal = await Cache.store('memory').get('session_id');
```
