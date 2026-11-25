# Unified Preact + Inertia + SSR

BirJS combines Laravel-style server routing and controllers with a single unified **Preact + Inertia + SSR** frontend stack. Write all your pages and interactive UI using one consistent TSX standard (`preact`) with full `useState`, `useEffect`, and `onClick` support — while preserving instant Server-Side Rendering (SSR) on initial page load.

---

## How It Works

1. **First Page Load (SEO + Zero Flicker):**
   When a user or search engine visits `/`, `ctx.inertia('Welcome', props)` renders `views/pages/Welcome.tsx` on the server via `preact-render-to-string`, embeds the serialized props in `<div id="app" data-page="...">`, and Preact (`3 KB`) hydrates it seamlessly in the browser.
2. **SPA Transitions (`<Link>` & `router`):**
   Clicking `<Link href="/invoices">` sends a lightweight fetch with `X-Bir-Inertia: true`. BirJS returns only `{ component, props, url }` as JSON, swapping the active page without a full page reload — keeping persistent layouts, modals, or chat widgets alive.

---

## Returning Inertia Pages from Controllers

```ts
// app/controllers/InvoiceController.ts
import type { Context } from 'birframework';
import { Invoice } from '@/app/models/Invoice';

export class InvoiceController {
  public async index(ctx: Context) {
    const invoices = await Invoice.all();
    // Resolves views/pages/Invoices/Index.tsx
    return ctx.inertia('Invoices/Index', { invoices });
  }
}
```

---

## Writing Pages & Persistent Layouts

```tsx
// views/pages/Invoices/Index.tsx
import { useState } from 'preact/hooks';
import { Link, router, usePage } from '@/resources/js/bir-inertia';

export default function Index({ invoices }: { invoices: any[] }) {
  const { props } = usePage<{ flash?: { success?: string } }>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <nav className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-zinc-400 hover:text-white">Home</Link>
        <button onClick={() => setModalOpen(true)} className="px-3 py-1.5 rounded bg-white text-black text-xs font-medium">
          New Invoice
        </button>
      </nav>

      {props.flash?.success && (
        <div className="mb-4 p-3 rounded bg-emerald-500/10 text-emerald-400 text-xs">{props.flash.success}</div>
      )}

      <h1 className="text-2xl font-bold">Invoices ({invoices.length})</h1>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold">Create Invoice</h2>
            <button onClick={() => { router.post('/invoices', { amount: 100 }); setModalOpen(false); }}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Sharing Global Props (`Inertia.share`)

Share authenticated user state or global settings across every page automatically:

```ts
import { Inertia, Auth } from 'birframework';

Inertia.share('auth', async (ctx) => ({
  user: await Auth.user(ctx),
}));
```

Session flash messages (`success`, `error`, `errors`) are shared automatically on `props.flash`.

---

## External / Full Redirects (`Inertia.location`)

```ts
import { Inertia } from 'birframework';

Inertia.location(ctx, '/login'); // Sends 409 X-Bir-Inertia-Location for SPA requests
```
