# Localization & i18n Translation

BirJS provides an intuitive internationalization (i18n) and translation system inspired by Laravel, supporting parameter interpolation and fallback locales for use in controllers and components.

---

## 1. Translation Files

Store your translation files under `lang/` or `resources/lang/` as JSON files named after their locale code (e.g. `lang/en.json`, `lang/tr.json`):

```json
// lang/en.json
{
  "welcome": "Welcome back, {name}!",
  "auth": {
    "failed": "These credentials do not match our records.",
    "throttle": "Too many login attempts. Please try again in :seconds seconds."
  }
}
```

```json
// lang/tr.json
{
  "welcome": "Hoş geldiniz, {name}!",
  "auth": {
    "failed": "Girdiğiniz bilgiler kayıtlarımızla eşleşmiyor.",
    "throttle": "Çok fazla giriş denemesi. Lütfen :seconds saniye sonra tekrar deneyin."
  }
}
```

---

## 2. Using the `__()` Helper and `Lang` Facade

Translate keys anywhere in your application:

```typescript
import { __, Lang } from 'birframework';

// Simple translation
const hello = __('welcome', { name: 'Taylor' });
// -> "Welcome back, Taylor!"

// Dot notation nested key
const error = __('auth.failed');

// Parameter replacement supports both :param and {param}
const throttle = __('auth.throttle', { seconds: 30 });
```

### Switching Locales Dynamically

```typescript
// Change locale at runtime
Lang.setLocale('tr');
console.log(__('welcome', { name: 'Ahmet' })); // "Hoş geldiniz, Ahmet!"

// Check if a translation key exists
if (Lang.has('auth.failed')) {
  // ...
}
```

---

## 3. Translations in pages

Translate using the request locale in your controller and pass the result as page props.

```ts
Route.get('/welcome', (ctx) => ctx.inertia('Welcome', {
  message: ctx.__('welcome', { name: 'Ahmet' }),
}));
```

```tsx
export default function Welcome({ message }: { message: string }) {
  return <h1>{message}</h1>;
}
```

## 4. Context Locale Detection

In your route handlers and controllers, `ctx.locale` automatically inspects:
1. `?lang=tr` URL query parameter
2. `X-Locale` HTTP request header
3. Falls back to default `APP_LOCALE`

```typescript
Route.get('/welcome', (ctx) => {
  // Translates automatically using request's detected locale:
  const message = ctx.__('welcome', { name: 'Ferdi' });
  return ctx.json({ message, locale: ctx.locale });
});
```
