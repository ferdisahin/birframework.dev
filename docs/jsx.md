# Type-Safe JSX & TSX Components

BirJS features a native, zero-dependency **JSX & TSX view engine**. You can build your frontend using React-style functional components with 100% TypeScript type-safety while generating clean, pure HTML on the server with **zero client bundle overhead**.

---

## Why JSX in BirJS?

| Feature | Blade (`.html`) | TSX / JSX Components |
| :--- | :---: | :---: |
| **Syntax** | Laravel Blade directives & tags | React-style functional components |
| **Type Safety** | Dynamic runtime | **100% Compile-time TypeScript IntelliSense** |
| **Client Bundle Size** | 0 KB | **0 KB** (Server-rendered HTML) |
| **Async Components** | Supported via Controller | **Native async server components** (`await DB.query()`) |
| **Best For** | Traditional backend developers | React / Full-Stack TypeScript developers |

---

## Creating a New Project with JSX

When creating a new project, select **TSX / JSX** as your view template engine:

```bash
# Interactive setup (Select Option 2 for TSX / JSX):
npx birframework new my-app

# Or use direct flags:
npx birframework new my-app --ts --tailwind --jsx
```

---

## Writing Functional JSX Components

In BirJS, a component is simply a JavaScript or TypeScript function that returns JSX.

### 1. Creating a Reusable Component (`views/components/Card.tsx`)

```tsx
interface CardProps {
  title: string;
  badge?: string;
  children: any;
}

export function Card({ title, badge, children }: CardProps) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-zinc-950 dark:text-white">{title}</h3>
        {badge && (
          <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </div>
  );
}
```

### 2. Creating a Master Layout (`views/layouts/Layout.tsx`)

```tsx
interface LayoutProps {
  title: string;
  children: any;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title} - BirJS</title>
        <link rel="stylesheet" href="/css/app.css" />
      </head>
      <body className="bg-black text-zinc-100 min-h-screen flex flex-col font-sans">
        <header className="border-b border-zinc-900 px-6 py-4">
          <span className="font-bold">BirJS Application</span>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
```

### 3. Creating a Page View (`views/Welcome.tsx`)

```tsx
import { Layout } from './layouts/Layout.js';
import { Card } from './components/Card.js';

interface WelcomeProps {
  user: { name: string; role: string };
  products: Array<{ id: number; name: string; price: number }>;
}

export default function Welcome({ user, products }: WelcomeProps) {
  return (
    <Layout title="Dashboard">
      <h1 className="text-3xl font-extrabold tracking-tight">
        Welcome back, {user.name}!
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {products.map((product) => (
          <Card key={product.id} title={product.name} badge={`$${product.price}`}>
            High performance product item.
          </Card>
        ))}
      </div>
    </Layout>
  );
}
```

---

## Rendering from Controllers

Render JSX directly using `ctx.render(<Component />)`:

```typescript
// app/controllers/HomeController.ts
import type { Context } from 'birframework';
import Welcome from '../../views/Welcome.js';
import { Product } from '../models/Product.js';

export class HomeController {
  public async index(ctx: Context) {
    const products = await Product.all();

    return ctx.render(
      <Welcome 
        user={{ name: 'Jane Doe', role: 'Admin' }} 
        products={products} 
      />
    );
  }
}
```

---

## Native Async Server Components

BirJS natively supports **async server components**. You can fetch data or query databases directly inside your components:

```tsx
async function RecentOrders() {
  const orders = await Order.latest().limit(5).get();

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Recent Orders</h3>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>Order #{o.id} - ${o.total}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Raw HTML & Escaping

BirJS automatically escapes all text and attribute expressions to prevent XSS attacks.

To render trusted unescaped HTML, use the `raw()` helper or `dangerouslySetInnerHTML`:

```tsx
import { raw } from 'birframework';

// Using raw() helper:
<p>{raw('<strong>Safe bold text</strong>')}</p>

// Or React standard dangerouslySetInnerHTML:
<div dangerouslySetInnerHTML={{ __html: article.renderedHtml }} />
```

---

## String-Based View Resolution (`ctx.render('Home', props)`)

You do not need relative `../../views/...` imports in your controllers. `ctx.render()` automatically resolves `.tsx` and `.jsx` files inside your root `views/` directory:

```ts
// app/controllers/HomeController.ts
import type { Context } from 'birframework';

export class HomeController {
  public async index(ctx: Context) {
    // Resolves views/Home.tsx automatically
    return ctx.render('Home', { title: 'Welcome to BirJS' });
  }

  public async admin(ctx: Context) {
    // Dot-notation resolves views/admin/Dashboard.tsx
    return ctx.render('admin.Dashboard', { stats: { users: 142 } });
  }
}
```

If you prefer explicit JSX tags (`<Home />`), use the `@/*` path alias from any folder depth:

```tsx
import Home from '@/views/Home'; // or '@/views/Home.tsx'
return ctx.render(<Home title="Welcome" />);
```

---

## Built-In Form & Flash Components

Import ready-made form and session helpers from `birframework/jsx`. Thanks to request-scoped `AsyncLocalStorage`, they automatically read the active CSRF token and session flash messages without prop drilling:

```tsx
import { Csrf, Method, ErrorMessage, Flash } from 'birframework/jsx';

export function ProfileForm() {
  return (
    <form method="POST" action="/profile">
      <Csrf />
      <Method method="PUT" />
      <Flash type="success" />

      <input type="email" name="email" />
      <ErrorMessage field="email" />

      <button type="submit">Save</button>
    </form>
  );
}
```

---

## TSConfig Configuration

BirJS uses `Bundler` module resolution with `@/*` path aliases and `.tsx` extension imports enabled out of the box:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "birframework",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```
BirJS automatically exports `./jsx-runtime` to seamlessly integrate with TypeScript, `tsx`, and Vite.
