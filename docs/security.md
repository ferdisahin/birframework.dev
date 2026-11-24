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
