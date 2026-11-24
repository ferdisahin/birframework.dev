# Blade Component Engine

BirJS features a high-performance, zero-dependency template compiler bringing Laravel Blade ergonomics and component slots to Node.js.

---

## Component Tags & Slots

Wrap your views in master layout components using `<x-layouts.name>`:

```html
<!-- views/profile.html -->
<x-layouts.app title="User Profile">
  <div class="container">
    <h1>Welcome, {{ user.name }}!</h1>
    <p>Email: {{ user.email }}</p>
  </div>

  <x-slot name="sidebar">
    <nav>
      <a href="/profile/edit">Edit Profile</a>
      <a href="/profile/security">Security</a>
    </nav>
  </x-slot>
</x-layouts.app>
```

Layout template receiving the content and slots:

```html
<!-- views/layouts/app.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{ title }} - My App</title>
</head>
<body>
  <aside>
    {!! sidebar !!}
  </aside>

  <main>
    {!! slot !!}
  </main>
</body>
</html>
```

---

## Directives & Control Structures

### Conditionals

```html
@if(user.isAdmin)
  <span class="badge">System Administrator</span>
@else
  <span class="badge">Standard Member</span>
@endif
```

### Loops

BirJS natively supports Laravel-style **`@foreach(products as product)`** loops:

```html
<!-- 1. Clean Laravel Style (Recommended) -->
<ul>
  @foreach(products as product)
    <li>{{ product.name }} - ${{ product.price }}</li>
  @endforeach
</ul>

<!-- 2. Key-Value Index Pairing -->
@foreach(products as index => product)
  <div>#{{ index }}: {{ product.name }}</div>
@endforeach

<!-- 3. Classic $ Prefix (Optional) -->
<ul>
  @foreach($products as $product)
    <li>{{ product.name }}</li>
  @endforeach
</ul>
```

### Escaping vs. Raw HTML

```html
<!-- Escaped (XSS Safe) -->
<p>{{ userInput }}</p>

<!-- Raw HTML (Unescaped) -->
<div>{!! paginationLinks !!}</div>
```

---

## Native Markdown Directives (v0.1.3+)

BirJS includes a zero-dependency Markdown compiler built right into the Blade view engine.

### Block Directive (`@markdown`)

````html
@markdown
# Release Notes

We are thrilled to announce **BirJS 0.1.3**!
- Native Markdown compiler in Blade
- Live Reload via Server-Sent Events
- Automatic port switching

```ts
import { Application } from 'birframework';
const app = new Application();
```
@endmarkdown
````

### Variable Directive (`@markdown(expression)`)

Render markdown strings passed from your database or controllers:

```html
<article class="prose">
  @markdown(post.body)
</article>
```

---

## Verbatim Code Escaping (`@verbatim`)

When writing documentation or using frontend template tags like Vue or Alpine, use `@verbatim` to tell BirJS not to parse double curly braces:

```html
@verbatim
  <div x-data="{ count: 0 }">
    <button @click="count++">Count: {{ count }}</button>
  </div>
@endverbatim
```

You can also escape a single expression with `@{{ variable }}`.

---

## Co-Located Components & JavaScript

BirJS allows components to bundle their client-side interactive JavaScript right alongside their `.bir` template files with automatic scoping and zero bundler overhead:

```bash
bir make:component dropdown -j
```

Read the full guide in [Blade Components & Co-Located JavaScript](/docs/components).

