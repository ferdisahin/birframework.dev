# Components

Build reusable interface elements as Preact functions in `views/components/`. Use props for data, children for nested content, and hooks for browser interaction in hydrated Inertia pages.

## Generate a component

```bash
npx bir make:component Card
```

The generator creates `views/components/Card.tsx` in a TypeScript project or `Card.jsx` in a JavaScript project.

## Props and children

```tsx
import type { ComponentChildren } from 'preact';

export function Card({ title, children }: {
  title: string;
  children?: ComponentChildren;
}) {
  return <section class="rounded-lg border p-6">
    <h2>{title}</h2>
    {children}
  </section>;
}
```

Import the component into a page and compose it with other components.

```tsx
import { Card } from '../components/Card';

export default function Welcome() {
  return <Card title="Your project"><p>Ready to build.</p></Card>;
}
```

## Interactive components

```tsx
import { useState } from 'preact/hooks';

export function Toggle() {
  const [open, setOpen] = useState(false);
  return <div>
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
      Details
    </button>
    {open && <p>More information about this item.</p>}
  </div>;
}
```

Use this component in a hydrated Inertia page. Browser event handlers require a client bundle. Server-only rendering produces HTML without activating handlers.

## Organizing components

Group related components in subdirectories and keep complete screens in `views/pages/`. Share state through props and callbacks. Keep browser-only APIs inside event handlers or effects so server rendering can run without `window` or `document`.
