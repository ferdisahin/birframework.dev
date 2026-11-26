# Security

BirJS provides session signing, CSRF middleware, password hashing, rate limiting, encryption, and authorization helpers. Register the middleware required by your application explicitly.

## Application key

```bash
npx bir key:generate
```

Keep APP_KEY private and stable across workers and deployments. Session signing can use a temporary process secret when the key is missing, which invalidates sessions after restarts. Crypt and SignedUrl require a configured key.

## Sessions and CSRF

```ts
import { sessionMiddleware, csrf, csrfToken, Route } from 'birframework';

app.use(sessionMiddleware());
app.use(csrf());

Route.get('/profile', (ctx) => ctx.inertia('Profile', {
  csrfToken: csrfToken(ctx),
}));
```

Register sessions before CSRF. The csrf middleware checks state-changing requests on routes where it runs. Read-only GET, HEAD, and OPTIONS requests are exempt.

```tsx
export function ProfileForm({ csrfToken }: { csrfToken: string }) {
  return <form method="POST" action="/profile">
    <input type="hidden" name="_token" value={csrfToken} />
    <input name="name" />
    <button type="submit">Save</button>
  </form>;
}
```

Fetch requests can send `X-CSRF-TOKEN` or `X-XSRF-TOKEN`. The body field is `_token`. Obtain it from server-provided props or an explicitly rendered meta tag.

## Rate limiting

```ts
import { Route, rateLimit } from 'birframework';

Route.post('/login', loginHandler).middleware(rateLimit({ max: 5, windowMs: 60000 }));
```

The built-in limiter is process-local. Proxy headers are trusted only when configured. Use an appropriate shared limit at your infrastructure layer when running multiple instances.

## Mass assignment and SQL

```ts
import { Model } from 'birframework';

export class User extends Model {
  static table = 'users';
  static fillable = ['name', 'email'];
}
```

Use validated fields and an explicit fillable allowlist. Query builder values use bindings. Raw SQL passed to DB.raw or DB.execute remains the application's responsibility. Pass values separately as parameters.

## Security headers

Application registers securityHeaders by default. The default response headers include X-Content-Type-Options nosniff, X-Frame-Options SAMEORIGIN, Referrer-Policy strict-origin-when-cross-origin, and X-XSS-Protection 0.

## Encryption and signed URLs

```ts
import { Crypt, SignedUrl, signed, Route } from 'birframework';

const encrypted = Crypt.encrypt({ apiKey: 'example' });
const credentials = Crypt.decrypt<{ apiKey: string }>(encrypted);
const url = SignedUrl.sign('/invoices/1042/pdf', 1800);
Route.get('/invoices/:id/pdf', downloadHandler).middleware(signed());
```

## Authorization

```ts
import { Gate } from 'birframework';

Gate.define('cancel-invoice', (user, invoice) => user?.id === invoice.userId);
await Gate.authorize('cancel-invoice', user, invoice);
```

## Webhook signatures

Read the original request bytes with `await ctx.rawBody()`. Verify the received signature using the provider's exact signing format and a timing-safe comparison before processing the event. Calculating an HMAC alone does not authenticate a webhook.
