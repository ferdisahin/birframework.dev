# Security & Defense-in-Depth

BirJS is engineered with enterprise-grade security defaults at every layer: HTTP protocol, sessions, cookies, views, database queries, and background queues.

---

## Application Key (`APP_KEY`)

In web applications, sessions and cookies must be cryptographically signed using HMAC-SHA256 to prevent tampering, cookie forgery, and privilege escalation attacks.

### Configuration

Add `APP_KEY` to your `.env` file (or host environment variables like Vercel, Railway, AWS, Docker):

```env
APP_KEY=bir_sec_98f4b7a1e0c24d98a3b5c6e7f8a9b0c1
```

You can generate a cryptographically strong 32-byte key at any time:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Production Graceful Fallback (Zero Downtime)

In `production` mode (`NODE_ENV=production`), if `APP_KEY` is not configured, BirJS **does not crash your application**. 

Instead, it automatically generates a temporary in-memory ephemeral 32-byte secret and issues a warning in your server logs:

```text
[BirSecurity] WARNING: APP_KEY is not set in production. A temporary runtime-generated secret is being used. Sessions will invalidate across serverless cold starts or restarts. Please configure APP_KEY in your environment variables.
```

This prevents zero-day forgery vulnerabilities while guaranteeing that your site never goes down due to a missing environment variable.

---

## CSRF Protection

Cross-Site Request Forgery (CSRF) is enabled across all state-changing HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`).

### Generating Tokens in Views

Use the `@csrf` directive inside HTML forms:

```html
<form method="POST" action="/profile/update">
  @csrf
  <input type="text" name="name" value="Jane Doe" />
  <button type="submit">Save</button>
</form>
```

This automatically compiles to a hidden input field:
```html
<input type="hidden" name="_csrf" value="b8a1e0c2..." />
```

### In AJAX / Fetch Requests

BirJS reads CSRF tokens from:
- Request body parameter: `_csrf` or `_csrf_token`
- HTTP Headers: `X-CSRF-TOKEN` or `X-XSRF-TOKEN`

```javascript
fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
  },
  body: JSON.stringify({ title: 'New Task' })
});
```

---

## Session Fixation Protection

BirJS protects against Session Fixation attacks:
- When a user logs in via `Auth.attempt()`, `Auth.login()`, or `session.regenerate()`, BirJS automatically invalidates the old session ID, generates a new cryptographically random ID, and re-migrates the stored session data.
- The session cookie is re-issued immediately with `HttpOnly`, `SameSite=Lax`, and `Secure` (in HTTPS/production).

---

## Rate Limiting

Protect sensitive endpoints (login, password reset, payment processing) against brute force attacks using the built-in Rate Limiter:

```typescript
import { RateLimiter } from 'birframework';

const limiter = new RateLimiter({
  max: 5,        // max 5 requests
  windowMs: 60 * 1000 // per 1 minute
});

Route.post('/login', async (ctx) => {
  const ip = ctx.ip();
  if (limiter.tooManyAttempts(ip)) {
    return ctx.status(429).json({
      error: 'Too many login attempts. Please try again in 60 seconds.'
    });
  }
  
  // Proceed with authentication...
});
```

---

## SQL Injection Prevention & Mass Assignment

### 1. Parameterized Queries
The BirJS QueryBuilder and Active Record ORM use parameterized bindings (`?` or `$1`) for all inputs. SQL keywords, operator injection, and raw fragments are strictly escaped.

### 2. Model Fillable & Guarded Attributes
Prevent malicious users from overwriting sensitive fields (such as `is_admin` or `role`) using `fillable` or `guarded`:

```typescript
import { Model } from 'birframework';

export class User extends Model {
  // Only allow mass-assignment on these fields:
  protected fillable = ['name', 'email', 'avatar'];

  // Or alternatively, guard specific fields:
  // protected guarded = ['id', 'is_admin', 'password_hash'];
}
```

---

## Security Headers

BirJS automatically injects industry-standard security headers on all responses:
* `X-Content-Type-Options: nosniff`
* `X-Frame-Options: SAMEORIGIN`
* `Referrer-Policy: strict-origin-when-cross-origin`
* `X-XSS-Protection: 1; mode=block`

---

## Two-Way Encryption (`Crypt` — AES-256-GCM)

Encrypt and decrypt sensitive credentials (such as API tokens, server passwords, or payment keys) using `APP_KEY` (generate one via `npx bir key:generate`):

```ts
import { Crypt } from 'birframework';

// Encrypt strings or JSON objects
const encrypted = Crypt.encrypt({ host: 'srv1.example.com', apiKey: 'secret_99' });

// Decrypt back to the original object
const credentials = Crypt.decrypt<{ host: string; apiKey: string }>(encrypted);
```

---

## Signed URLs (`SignedUrl` & `signed()`)

Generate tamper-proof, expiring URLs for invoice downloads, email verification, or password resets:

```ts
import { Route, SignedUrl, signed } from 'birframework';

// Generate a URL valid for 30 minutes (1800 seconds)
const downloadUrl = SignedUrl.sign('/invoices/1042/pdf', 1800);

// Protect the route with the signed() middleware (returns 403 if tampered or expired)
Route.get('/invoices/:id/pdf', (ctx) => {
  return ctx.json({ invoiceId: ctx.params.id });
}).middleware(signed());
```

---

## Webhook Raw Body Access

Verify HMAC signatures on Stripe, iyzico, or PayTR webhooks using the unparsed raw request payload:

```ts
import { createHmac } from 'node:crypto';
import { Route } from 'birframework';

Route.post('/webhooks/stripe', async (ctx) => {
  const rawBuffer = await ctx.rawBody();
  const signature = createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!)
    .update(rawBuffer)
    .digest('hex');

  return ctx.json({ verified: true, signature });
});
```

---

## Authorization (`Gate` & `can()` Middleware)

Define role and resource-level authorization rules centrally:

```ts
import { Route, Gate, can } from 'birframework';

Gate.before((user) => {
  if (user?.role === 'superadmin') return true;
});

Gate.define('cancel-invoice', (user, invoice) => {
  return user?.id === invoice.userId;
});

// Check inside a controller
await Gate.authorize('cancel-invoice', user, invoice);

// Or protect routes with middleware
Route.delete('/admin/servers/:id', handler).middleware(can('manage-servers'));
```

---

## Route Rate Limiting (`throttle`)

Apply Laravel-style per-IP rate limiting directly to any route:

```ts
import { Route, throttle } from 'birframework';

// Allow 60 requests per 1 minute
Route.post('/api/checkout', handler).middleware(throttle(60, 1));
```
