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


## Persistent Layouts (`Page.layout`)

To keep shared UI (such as sidebars, audio players, or navigation state) mounted across page visits, attach a `layout` callback to your page component:

```tsx
import { AppLayout } from '../layouts/AppLayout';

export default function Dashboard({ stats }) {
  return <div>...</div>;
}

Dashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
```

## Forms & File Uploads (`useForm`)

Use `useForm` to manage form state, loading states, automatic `FormData` file serialization, and 422 validation errors:

```tsx
import { useForm } from '../resources/js/bir-inertia';

const { data, setData, post, processing, errors, wasSuccessful } = useForm({
  title: '',
  cover: null as File | null,
});

const submit = (e: Event) => {
  e.preventDefault();
  post('/tracks', { preserveScroll: true });
};
```

## Scroll Preservation, `<Head>`, & Navigation State

- **Scroll Preservation:** Pass `preserveScroll: true` to `<Link href="/..." preserveScroll />` or `router.visit(url, { preserveScroll: true })`.
- **Dynamic Document Head:** Use `<Head title="My Page" description="..." canonical="https://..." />` inside pages to sync `<title>`, `description`, `og:title`, `og:description`, and `canonical` on client navigation.
- **Progress Indicator:** `AppShell` renders a top `#bir-progress-bar` automatically during visits, and `useNavigation()` exposes `{ navigating }`.

## Server-Side SSR SEO & Meta Tags

Pass `lang`, `title`, `description`, `canonical`, and `meta` (`robots`, `og`, `twitter`, `tags`) directly from your controller:

```ts
await ctx.inertia('TldDetail', { tld: 'com' }, {
  lang: 'tr',
  title: '.com Domain Prices',
  description: 'Compare .com registration and renewal prices.',
  canonical: 'https://example.com/tld/com',
  meta: {
    robots: 'index, follow',
    og: { image: 'https://example.com/og.png', siteName: 'tlds' },
    twitter: { card: 'summary_large_image' },
  },
});
```
