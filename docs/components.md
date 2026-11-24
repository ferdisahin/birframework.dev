# Blade Components & Co-Located JavaScript

BirJS introduces a modern, modular approach to server-rendered frontend components. Inspired by Laravel Blade and Astro, BirJS allows you to co-locate your HTML templates and their client-side interactive JavaScript in the same component directory with zero build configuration.

---

## Component Anatomy

In BirJS, components can live in either of two structures:

### 1. Single-file Components
`views/components/card.bir` &rarr; Used via `<x-card title="Card Title">Content</x-card>`.

### 2. Co-Located Folder Components (With Companion JS)
```text
views/components/modal/
├── modal.bir    # Server-rendered template
└── modal.js     # Scoped client-side companion script
```
Rendered in templates via:
```html
<x-modal id="deleteModal" title="Are you sure?">
  This action cannot be undone.
</x-modal>
```

---

## Creating Components with the CLI

Use the `-j` (or `--js`) flag with `bir make:component` to create a co-located component directory with template and companion script:

```bash
# Basic single file component:
bir make:component card

# Co-located component with companion JavaScript:
bir make:component modal -j
```

This creates:
- `views/components/modal/modal.bir`
- `views/components/modal/modal.js`

---

## How Companion Scripts Work

BirJS's View Engine automatically handles modern script bundling and scoping:

1. **Automatic Root Tagging**: The engine automatically tags the component's root DOM element with `data-bir-component="modal"`.
2. **Body-End Injection & Deduplication**: No matter how many times `<x-modal>` appears on the page, the `<script type="module">` tag is imported only once before the closing `</body>` tag.
3. **Scoped Auto-Mounting**: The default export function is automatically called for each DOM element instance of the component on page load:
   ```javascript
   import init from "/components/modal.js";
   document.querySelectorAll('[data-bir-component="modal"]').forEach(el => init(el));
   ```

---

## Writing a Scoped Component Script

In your companion script, export a default function that receives the component's root element (`el`):

```javascript
// views/components/modal/modal.js
export default function initModal(el) {
  // Queries are safely scoped to this instance:
  const closeBtn = el.querySelector('.btn-close');
  const backdrop = el.querySelector('.modal-backdrop');

  const open = () => el.classList.remove('hidden');
  const close = () => el.classList.add('hidden');
  const toggle = () => el.classList.toggle('hidden');

  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  // Listen for custom trigger events from other components
  el.addEventListener('modal:open', open);
  el.addEventListener('modal:close', close);
  el.addEventListener('modal:toggle', toggle);
}
```

---

## Inter-Component Communication (Controlling One Component from Another)

A common challenge in component architectures is: **How does a separate button component open or close a modal?**

BirJS provides two clean, conflict-free patterns:

### Pattern 1: Target ID & Custom DOM Events (Declarative & Decoupled — Recommended)

The button does not need to know anything about the modal's internal DOM structure. It simply dispatches a custom event targeting the modal's `id`:

#### The Button Component (`views/components/button/button.bir` + `button.js`):
```html
<!-- views/components/button/button.bir -->
<button 
  type="button" 
  class="btn {{ class ?? 'btn-primary' }}" 
  data-target="{{ target }}" 
  data-action="{{ action ?? 'toggle' }}"
>
  {!! slot !!}
</button>
```

```javascript
// views/components/button/button.js
export default function initButton(el) {
  const targetId = el.getAttribute('data-target');
  const action = el.getAttribute('data-action') || 'toggle';
  if (!targetId) return;

  el.addEventListener('click', () => {
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.dispatchEvent(new CustomEvent(`modal:${action}`));
    }
  });
}
```

#### Usage in Your Views:
```html
<!-- views/welcome.bir -->
<x-button target="confirmModal" action="open">
  Delete User
</x-button>

<x-modal id="confirmModal" title="Delete Confirmation">
  <p>Are you sure you want to permanently delete this user?</p>
</x-modal>
```

---

### Pattern 2: Global Component Registry (`window.BirModal`)

If you also need to open or close modals programmatically from JavaScript (for example, after a successful `fetch()` API call):

```javascript
// views/components/modal/modal.js
window.BirModal = window.BirModal || {};

export default function initModal(el) {
  const id = el.id;
  if (!id) return;

  const instance = {
    open: () => el.classList.remove('hidden'),
    close: () => el.classList.add('hidden'),
    toggle: () => el.classList.toggle('hidden')
  };

  // Register on global window object by ID
  window.BirModal[id] = instance;

  el.querySelector('.btn-close')?.addEventListener('click', instance.close);
}
```

Now you can trigger it anywhere:
```html
<!-- In HTML inline: -->
<button onclick="BirModal.confirmModal.open()">Open</button>

<!-- Or in JavaScript fetch handler: -->
<script>
  const res = await fetch('/api/users/1', { method: 'DELETE' });
  if (res.ok) {
    BirModal.confirmModal.close();
  }
</script>
```

---

## Props and Slots

Components support all Laravel Blade style slots and attributes:

```html
<!-- views/components/card.bir -->
<div class="card border rounded-lg p-6 bg-white dark:bg-zinc-900">
  @if(header)
    <div class="card-header border-b pb-3 mb-4 font-bold">
      {!! header !!}
    </div>
  @endif

  <div class="card-body">
    {!! slot !!}
  </div>

  @if(footer)
    <div class="card-footer border-t pt-3 mt-4 text-xs text-zinc-500">
      {!! footer !!}
    </div>
  @endif
</div>
```

Usage with named slots:
```html
<x-card>
  <x-slot:header>User Profile</x-slot:header>
  
  <p>This is the main card body content.</p>

  <x-slot:footer>Last active 2 minutes ago</x-slot:footer>
</x-card>
```
