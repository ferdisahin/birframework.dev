# Instant Turbo Navigation & Hotwire

BirJS gives you Single-Page Application (SPA) speed with sub-millisecond server rendering. Rather than requiring complex client-side frameworks (like React, Vue, or Svelte), BirJS offers **first-class support for both Hotwire Turbo and BirTurbo**.

---

## The Two Turbo Engines in BirJS

When you create a project with `bir new my-app`, BirJS prompts you to choose your navigation engine:

```bash
# 1. Official Hotwire Turbo (@hotwired/turbo) - Full-Featured Enterprise SPA
bir new my-app --hotwire

# 2. Native BirTurbo - Zero-Dependency Micro-Turbo (~2.5 KB)
bir new my-app --birturbo

# 3. Standard MPA (Multi-Page App without Turbo)
bir new my-app --no-turbo
```

### Feature Comparison

| Feature | Official Hotwire Turbo (`@hotwired/turbo`) | Native BirTurbo (`bir_scripts()`) |
| :--- | :---: | :---: |
| **Origin** | Basecamp / 37signals (Rails standard) | Native BirJS lightweight engine |
| **Bundle Size** | ~14 KB (via npm & Vite) | **~2.5 KB inline script** (zero npm dependencies) |
| **Setup Required** | `npm install @hotwired/turbo` | `{!! bir_scripts() !!}` (built-in) |
| **Turbo Drive (Link / Form interception)** | ✅ Yes | ✅ Yes |
| **Top Progress Loading Bar** | ✅ Yes | ✅ Yes (automatic styled bar) |
| **Turbo Frames (`<turbo-frame>`)** | ✅ Yes (partial scoped DOM updates) | ❌ No (full body swap) |
| **Turbo Streams (`<turbo-stream>`)** | ✅ Yes (WebSocket / SSE live DOM morphing) | ❌ No |
| **Ideal For** | Complex SaaS, live chats, real-time dashboards | Content sites, docs, blogs, admin panels |

---

## 1. Official Hotwire Turbo (`@hotwired/turbo`)

Hotwire Turbo is the gold standard for HTML-over-the-wire web applications, used by applications like Basecamp, GitHub, and HEY.

### Installation & Setup

If you created your project with `--hotwire` (or default):

```javascript
// resources/js/app.js
import * as Turbo from '@hotwired/turbo';

// Turbo is automatically initialized!
```

Ensure your master layout compiles Vite assets:

```html
<!-- views/layouts/app.bir -->
<head>
  @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
```

### Turbo Drive (Instant Page Transitions)

Hotwire automatically converts all standard link clicks (`<a href="...">`) and form submissions (`<form method="POST">`) into AJAX requests:
1. Intercepts link clicks or form submissions.
2. Fetches the response HTML in the background.
3. Merges the `<head>` and replaces the `<body>` without a full browser reload.
4. Preserves scroll positions and animates the top progress bar.

### Turbo Frames (Partial Page Updates)

Turbo Frames allow you to decompose pages into independent contexts that update in isolation without touching the rest of the page:

```html
<!-- views/posts/show.bir -->
<div class="main-content">
  <h1>{{ post.title }}</h1>
  <p>{{ post.content }}</p>

  <!-- Only this frame reloads when links inside it are clicked: -->
  <turbo-frame id="comments-section" src="/posts/{{ post.id }}/comments">
    <p class="text-zinc-500">Loading comments...</p>
  </turbo-frame>
</div>
```

When an edit link inside `<turbo-frame id="comment_42">` is clicked, only comment #42 reloads into an inline edit form!

### Turbo Streams (Real-Time Live Updates via WebSockets/SSE)

Turbo Streams deliver granular DOM updates over Server-Sent Events or WebSockets with 7 actions: `append`, `prepend`, `replace`, `update`, `remove`, `before`, and `after`.

```html
<!-- Server sends this HTML snippet over WebSocket: -->
<turbo-stream action="append" target="chat-messages">
  <template>
    <div class="message">
      <strong>Jane:</strong> Hello everyone!
    </div>
  </template>
</turbo-stream>
```

When the client receives this fragment, Turbo automatically appends it to `#chat-messages` in the DOM without running custom client code!

---

## 2. Native BirTurbo (`{!! bir_scripts() !!}`)

If you do not want an npm dependency on `@hotwired/turbo` or prefer a pure zero-build setup, **BirTurbo** provides instant page transitions in a 2.5 KB inline footprint.

### How to Enable BirTurbo

Simply place `{!! bir_scripts() !!}` before the closing `</body>` tag of your master layout:

```html
<!-- views/layouts/app.bir -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body class="bg-white dark:bg-black">
  {!! slot !!}

  <!-- Injects lightweight BirTurbo SPA engine (~2.5 KB) -->
  {!! bir_scripts() !!}
</body>
</html>
```

### What BirTurbo Does Automatically:
1. **Click Interception**: Intercepts internal `<a>` links and fetches the destination using `fetch()`.
2. **Top Progress Bar**: Renders a sleek, native progress bar (`#bir-turbo-progress`) at the top of the browser.
3. **DOM Morphing**: Seamlessly swaps the document title and `<body>` without resetting JavaScript state or causing white screen flashes.
4. **Browser History**: Updates browser URL and history stack via `window.history.pushState`.
5. **Lifecycle Events**: Dispatches standard `turbo:load` and `turbo:render` events on every navigation.

---

## Lifecycle Events (Handling Dynamic JavaScript)

Because Turbo does not trigger standard `DOMContentLoaded` on every page visit, you should attach page-level event listeners to `turbo:load`:

```javascript
// Runs on initial page load AND every Turbo page transition:
document.addEventListener('turbo:load', () => {
  console.log('Page loaded or navigated via Turbo!');
  
  // Re-initialize tooltips, dropdowns, or charts
  initCharts();
});

// Runs just before the current page is swapped out:
document.addEventListener('turbo:before-render', () => {
  // Teardown timers or active animations
});
```

> [!NOTE]
> BirJS's **Co-Located Components** (`views/components/<name>/<name>.js`) automatically listen for `turbo:load` behind the scenes. Any `export default function(el) { ... }` in your component companion scripts is automatically re-mounted on every Turbo navigation!

---

## Opting Out of Turbo Navigation

To force a standard browser full reload on a specific link or container, add `data-turbo="false"` or `data-no-turbo`:

```html
<!-- Single link bypass: -->
<a href="/downloads/report.pdf" data-turbo="false">Download PDF</a>

<!-- Entire section bypass: -->
<div data-turbo="false">
  <a href="/external-checkout">Proceed to External Checkout</a>
</div>
```
