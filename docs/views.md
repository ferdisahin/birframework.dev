# Views and Page Rendering

BirJS renders Preact components written in TSX or JSX. Choose the Inertia profile for client navigation and interactive pages, or the server-rendered profile for request-by-request HTML rendering.

## Inertia pages

Place page components in `views/pages/`. Controllers provide serializable props with `ctx.inertia()`.

```ts
Route.get('/', (ctx) => ctx.inertia('Welcome', { title: 'Welcome' }));
```

```tsx
// views/pages/Welcome.tsx
export default function Welcome({ title }: { title: string }) {
  return <main><h1>{title}</h1></main>;
}
```

Use the generated `Link` component from `resources/js/bir-inertia` for client navigation. A normal HTML anchor performs browser navigation.

## Server-rendered views

Place named views directly under `views/` in the server-rendered profile. Return them with `ctx.render()`.

```ts
Route.get('/', (ctx) => ctx.render('Welcome', { title: 'Welcome' }));
```

A server-rendered view uses the same TSX/JSX component syntax. Use the generated layout to include the document structure and assets.

## Generating a view

```bash
npx bir make:view Welcome
```

The generator detects the project language and whether `views/pages/` exists. It creates a `.tsx` or `.jsx` component in the appropriate directory.

## Layouts and reusable components

Keep shared page structure in `views/layouts/` and interface elements in `views/components/`. Pass content as props and children. See [Components](/docs/components) and [Inertia](/docs/inertia) for examples.

## Rendering data

Use JSX expressions, JavaScript conditionals, and array mapping. JSX text expressions escape user text. Render Markdown through an explicitly configured parser and sanitize untrusted HTML before inserting it into a page.
