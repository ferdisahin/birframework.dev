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

The generated Inertia profile boots four dedicated background processes using high-contrast terminal colors:

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
| **`queue`** | `#7209b7` (Purple) | `npx bir queue:work` | Consumes asynchronous background jobs. Run scheduled tasks with `bir schedule:work`. |
| **`logs`** | `#f72585` (Pink) | `npx bir pail` | Real-time structured log streaming with ANSI category badges. |
| **`vite`** | `#ffb703` (Amber) | `vite` | Vite dev server compiling client CSS, TypeScript, and Preact + Inertia `.tsx` pages. |

---

## Automatic Port Switching

The HTTP server retries the next port when its requested port is occupied. Vite handles its own port fallback when strictPort is false. Register birVite() so rendered asset URLs follow the port selected by Vite.

```text
➜ Port 3000 is in use, trying 3001 instead...
✔ Automatically switched to available port: http://localhost:3001
[app] BirJS ready at http://localhost:3001
```

You never need to manually hunt down and kill PID processes just to run your app.

---

## Tailwind CSS v4 Integration

BirJS fully supports Tailwind CSS v4. Because BirJS views (`.tsx` / `.jsx` pages and components) live under `views/`, the stylesheet uses `@source` scanning directives.

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
import { birVite } from 'birframework';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    birVite(),
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
    cors: true,
  },
});
```

Whenever you modify any file inside `views/` or `app/`, the browser automatically performs a full-reload with the latest rendered markup and compiled Tailwind utility styles.


## Vite port discovery

Register `birVite()` from `birframework` in your Vite plugins. The plugin writes the actual development server address to `storage/framework/vite.json`. Both Inertia and server-rendered Vite tags read this address, including when port 5173 is occupied and Vite selects another port.

```js
import { birVite } from 'birframework';

// In your existing Vite configuration:
// plugins: [birVite(), ...otherPlugins]
```

Allow port fallback with `strictPort: false` and omit a fixed `server.origin`. An explicit `VITE_DEV_SERVER_URL` overrides discovery, which is useful behind a development proxy. Production continues to use the build manifest.
