# Error Handling & Ignition Debug Screen

BirFramework includes a built-in, zero-config interactive error handling engine inspired by **Laravel Ignition** and **Next.js Error Overlay**.

---

## Interactive Ignition Debug Screen

In development (`NODE_ENV !== 'production'`), when an unhandled exception occurs during a browser request, BirFramework intercepts the failure and presents a sleek, interactive debug screen:

### Key Features
1. **Source Code Preview**: Automatically inspects the call stack, locates the exact application file and line number, and renders the code snippet with the faulting line highlighted in red.
2. **Filtered Stack Trace**: Distinguishes your application frames from external vendor / `node_modules` frames so you can focus on your code immediately.
3. **Context Tabs**:
   - **Request**: HTTP Method, URL, Path, and incoming request headers.
   - **Query & Body**: Parsed query parameters and POST payloads.
   - **Session**: Active session key-value pairs.
   - **Environment**: Node.js version, platform, OS architecture, and process uptime.

```
┌────────────────────────────────────────────────────────┐
│ BirFramework v0.4.0  •  GET /posts/my-slug  •  500 ERR │
├────────────────────────────────────────────────────────┤
│ TypeError: Cannot read properties of undefined         │
│ app/controllers/PostController.ts:42                   │
│                                                        │
│  40 │  const slug = ctx.params.slug;                   │
│  41 │  const post = await Post.firstWhere('slug', slug);│
│ >42 │  return ctx.render('posts/show', { post });      │
│  43 │}                                                 │
└────────────────────────────────────────────────────────┘
```

---

## API & JSON Error Responses

If an exception occurs during an API request (`Accept: application/json` or paths starting with `/api`), BirFramework automatically formats the error as structured JSON:

```json
{
  "error": "TypeError",
  "message": "Cannot read properties of undefined (reading 'title')",
  "file": "app/controllers/PostController.ts",
  "line": 42,
  "stack": "TypeError: Cannot read properties of undefined..."
}
```

---

## Production Security (`NODE_ENV=production`)

In production environments, detailed stack traces, file paths, and code snippets are **strictly masked** to protect sensitive infrastructure data:

- **Browser Requests**: Renders `views/errors/500.html` if present in your project, or falls back to BirFramework's minimal, production-safe 500 error page.
- **API Requests**: Returns `{ "error": "Internal Server Error", "message": "Server Error" }` with HTTP status `500`.

---

## Smart 404 Not Found Handling

When an incoming request matches no registered route:

1. **Browser Requests (`text/html`)**:
   - Automatically searches for `views/errors/404.html`.
   - If not found, renders BirFramework's built-in dark-themed 404 page displaying the requested path and a link back to the homepage.
2. **API Requests (`application/json` or `/api/*`)**:
   - Responds with standard 404 JSON:
   ```json
   {
     "error": "Not Found",
     "message": "Route [GET /unknown-path] not found.",
     "path": "/unknown-path",
     "method": "GET"
   }
   ```
