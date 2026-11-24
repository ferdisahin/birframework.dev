# Development Dashboard & Vite HMR

BirJS features a unified development environment designed to run your entire application stack in a single terminal session. Rather than opening separate terminal tabs for your web server, queue worker, asset compiler, and log watcher, BirJS coordinates all four services concurrently.

---

## The 4-Service Dev Dashboard

When you start your project with:

```bash
npm run dev
# or via CLI
npx bir dev
```

BirJS boots four dedicated background processes using high-contrast terminal colors:

```text
[server] > npx tsx watch app.ts
[queue]  > npx bir queue:work
[logs]   > npx bir pail
[vite]   > vite
```

### Process Roles

| Service | Color | Command | Purpose |
| :--- | :--- | :--- | :--- |
| **`server`** | `#00f5d4` (Teal) | `npx tsx watch app.ts` | The core HTTP server with Hot Reload on code changes. |
| **`queue`** | `#7209b7` (Purple) | `npx bir queue:work` | Consumes async background jobs and scheduled tasks. |
| **`logs`** | `#f72585` (Pink) | `npx bir pail` | Real-time structured log streaming with ANSI category badges. |
| **`vite`** | `#ffb703` (Amber) | `vite` | Vite dev server compiling client CSS, TypeScript, and Hotwire Turbo. |

---

## Automatic Port Switching

If your primary application port (`3000`) or Vite port (`5173`) is already being used by another application (e.g., Next.js, Docker, or another local project), BirJS intercepts the `EADDRINUSE` system error and automatically increments to the next available port:

```text
➜ Port 3000 is in use, trying 3001 instead...
✔ Automatically switched to available port: http://localhost:3001
[app] BirJS ready at http://localhost:3001
```

You never need to manually hunt down and kill PID processes just to run your app.

---

## Tailwind CSS v4 Integration

BirJS fully supports Tailwind CSS v4. Because BirJS views (both JSX/TSX server components and Blade `.bir` / `.html` templates) are rendered on the server outside of Vite's JavaScript module graph, the stylesheet requires `@source` scanning directives.

In `resources/css/app.css`:

```css
@import "tailwindcss";

@source "../../views";
@source "../../app";
```

These directives instruct Tailwind v4 to continuously inspect your controller returns, JSX components, and view templates for utility classes.

---

## Vite Backend Template Hot Reloading

When editing server-side templates or views, standard frontend bundlers typically do not trigger browser reloads. BirJS includes a custom watcher plugin inside `vite.config.js`:

```js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: 'bir-watch-views',
      handleHotUpdate({ file, server }) {
        if (file.includes('/views/') || file.includes('/app/')) {
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      },
    },
  ],
  server: {
    origin: 'http://localhost:5173',
    cors: true,
  },
});
```

Whenever you modify any file inside `views/` or `app/`, the browser automatically performs a full-reload with the latest rendered markup and compiled Tailwind utility styles.
