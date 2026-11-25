# Authentication & Sessions

BirJS provides built-in authentication services, secure cryptographically signed cookies, session handling, and a full-stack starter kit inspired by Laravel Breeze.

---

## Instant Auth Starter Kit (`make:auth`)

To scaffold a complete, production-ready authentication system with login, registration, password hashing, dashboard, and Tailwind CSS views in seconds:

```bash
npx birframework make:auth
```

This single command automatically scaffolds:
- `app/models/User.ts` (Active Record User model)
- `database/migrations/*_create_users_table.ts` (Schema migration)
- `app/controllers/AuthController.ts` (Login, Register, and Logout actions)
- `views/auth/login.html` & `views/auth/register.html` (Modern Tailwind UI forms)
- `views/dashboard.html` (Protected member dashboard)
- Automatically wires authentication routes into `routes/web.ts`

Run your migrations and test your new auth system:

```bash
npx birframework migrate
npm run dev
```

Navigate to `http://localhost:3000/login` to see your authentication UI in action.

---

## Password Hashing

Use `Hash` for one-way secure password hashing backed by modern SHA-256 / scrypt primitives:

```ts
import { Hash } from 'birframework';

// Hash a plaintext password
const hashedPassword = await Hash.make('secret-password');

// Verify a plaintext password against the hash
const isValid = await Hash.check('secret-password', hashedPassword);
```

---

## Authentication Attempt

Authenticate incoming login credentials in a controller action:

```ts
import { Auth } from 'birframework';

export class AuthController {
  public async login(ctx) {
    const { email, password } = ctx.validate({
      email: 'required|email',
      password: 'required',
    });

    const success = await Auth.attempt(ctx, { email, password });

    if (!success) {
      return ctx.unauthorized({ error: 'Invalid credentials' });
    }

    return ctx.redirect('/dashboard');
  }

  public async logout(ctx) {
    await Auth.logout(ctx);
    return ctx.redirect('/');
  }
}
```

---

## Signed Cookies & Sessions

BirJS cryptographically signs cookies using `APP_KEY` from your `.env` file to prevent client-side tampering:

```ts
// Set a session value
ctx.session.set('cart_items', [101, 102]);

// Read a session value
const items = ctx.session.get('cart_items', []);

// Flash a message (persists only for the next request)
ctx.session.flash('status', 'Your profile has been updated!');
```

---

## API Tokens & Mobile Authentication (Sanctum Style)

BirJS includes first-class support for issuance and verification of API tokens, allowing you to authenticate SPAs, mobile apps, or third-party API clients using Bearer tokens.

### Adding Token Capabilities to Models

Equip your `User` model with the `HasApiTokens` mixin:

```typescript
import { Model, HasApiTokens } from 'birframework';

export class User extends HasApiTokens(Model) {
  // Model attributes & relationships
}
```

### Issuing Personal Access Tokens

Issue a token with specific fine-grained abilities:

```typescript
// Issue a token with full permissions:
const { plainTextToken } = await user.createToken('mobile-app');

// Or issue a token with scoped abilities and expiration:
const { plainTextToken } = await user.createToken('deploy-key', ['servers:read', 'servers:deploy'], new Date(Date.now() + 30 * 86400000));

return ctx.json({ token: plainTextToken });
```

Tokens are prefixed with `bir_pat_` and hashed with SHA-256 before storage in the `personal_access_tokens` table.

### Protecting Routes with Bearer Auth

Use the built-in `auth()` and `hasAbility()` middlewares to guard your API routes:

```typescript
import { Route, auth, hasAbility } from 'birframework';

// Authenticate any valid Bearer token:
Route.get('/api/user', [auth()], async (ctx) => {
  return ctx.json(ctx.user);
});

// Guard route by specific token ability:
Route.post('/api/servers/deploy', [auth(), hasAbility('servers:deploy')], async (ctx) => {
  return ctx.json({ status: 'Deploying server...' });
});
```

Clients authenticate simply by sending the standard `Authorization` header:

```http
Authorization: Bearer bir_pat_98f4b7a1e0c24d98a3b5c6e7f8a9b0c1...
```



## Persistent Session Drivers (`FileSessionStore` & `DatabaseSessionStore`)

By default, `sessionMiddleware()` uses an in-memory store. For production deployments across restarts or multiple workers, configure `file` or `database` persistence:

```ts
import { sessionMiddleware, FileSessionStore, DatabaseSessionStore, setSessionStore } from 'birframework';

// Option 1: Built-in File store
app.use(sessionMiddleware({ driver: 'file', storeDir: 'storage/framework/sessions' }));

// Option 2: Database store (_sessions table for SQLite, PostgreSQL, or MySQL)
app.use(sessionMiddleware({ driver: 'database' }));

// Option 3: Set globally
setSessionStore(new FileSessionStore('storage/framework/sessions'));
```
