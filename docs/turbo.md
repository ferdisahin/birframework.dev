# Instant Turbo Navigation

BirFramework delivers Single-Page Application (SPA) speed and seamless transitions directly over server-rendered Blade templates.

---

## How It Works

When a user clicks a regular HTML link (`<a href="/docs/views">`), BirTurbo intercepts the click:
1. Fetches the next page HTML in the background via `fetch()`
2. Displays a slim, native top progress loading bar
3. Morphs the incoming DOM elements into place without reloading the page
4. Updates browser history with `pushState`

There are zero page flushes, zero white flashes, and no client-side framework (React, Vue, or Svelte) bundle required.

---

## Enabling BirTurbo

To enable Instant Turbo Navigation across your entire site, include `{!! bir_scripts() !!}` right before the closing `</body>` tag of your master layout:

```html
<!-- views/layouts/app.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
</head>
<body>
  {!! slot !!}

  <!-- Injects lightweight Turbo SPA morphing script (~2.5 KB) -->
  {!! bir_scripts() !!}
</body>
</html>
```

---

## Native Live Reload (v0.1.3+)

In development mode (`NODE_ENV !== 'production'`), `{!! bir_scripts() !!}` establishes a persistent Server-Sent Events (SSE) connection to `/__bir_live_reload`.

- **Template / Route Changes**: When any file in `views/`, `routes/`, `app/`, or `docs/` is modified, the browser DOM morphs instantly to reflect the latest content.
- **CSS Hot Swapping**: Editing any stylesheet triggers a `css-reload` event, hot-swapping CSS rules in milliseconds without scrolling the page or resetting form states.
