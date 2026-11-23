# HTTP Testing & Test Runner

BirJS includes a built-in HTTP testing assistant inspired by Laravel and Pest. You can write expressive, fluid integration and feature tests with zero third-party testing bloat.

---

## 1. Running Tests (`bir test`)

Run your entire test suite from the terminal with a single command:

```bash
npx birframework test
```

You can also filter tests by file name:

```bash
npx birframework test auth
npx birframework test upload
```

---

## 2. The `createTestClient` Assistant

Use `createTestClient(app)` to send requests through your application without managing manual network ports:

```typescript
import { test, describe, after } from 'node:test';
import { Application, createTestClient, type TestClient } from 'birframework';
import { app } from '../app.js';

describe('Authentication Feature Tests', () => {
  let client: TestClient;

  after(async () => {
    await client?.close();
  });

  test('guests can view login page', async () => {
    client = createTestClient(app);

    const res = await client.get('/login');

    res.assertOk()
       .assertSee('Sign In')
       .assertDontSee('Dashboard');
  });

  test('valid login redirects to dashboard', async () => {
    client = createTestClient(app);

    const res = await client.post('/login', {
      email: 'user@birjs.com',
      password: 'password123',
    });

    res.assertRedirect('/dashboard');
  });
});
```

---

## 3. Available Response Assertions

The `TestResponse` returned by `client.get()`, `client.post()`, etc. provides a rich set of chainable assertions:

### Status Assertions

```typescript
res.assertOk();              // Status 200
res.assertCreated();         // Status 201
res.assertNotFound();        // Status 404
res.assertForbidden();       // Status 403
res.assertUnauthorized();    // Status 401
res.assertUnprocessable();   // Status 422
res.assertStatus(code);      // Custom status check
```

### Redirect Assertions

```typescript
// Assert response was a redirect (301, 302, 307, 308)
res.assertRedirect();

// Assert response redirected to an exact path
res.assertRedirect('/dashboard');
```

### Content & JSON Assertions

```typescript
// Assert response text includes / excludes substring
res.assertSee('Welcome');
res.assertDontSee('Error occurred');

// Assert JSON body matches expected subset
res.assertJson({ success: true, count: 5 });

// Retrieve parsed bodies directly
const data = res.json();
const html = res.text();
```

---

## 4. Simulating Authenticated Requests (`actingAs`)

Simulate logged-in user requests without repeating login forms:

```typescript
test('authenticated user can view protected dashboard', async () => {
  client = createTestClient(app);

  const res = await client.actingAs(user).get('/dashboard');
  res.assertOk().assertSee('Welcome, ' + user.name);
});
```
