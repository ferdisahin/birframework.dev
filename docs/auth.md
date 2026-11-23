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
