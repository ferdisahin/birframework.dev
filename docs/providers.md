# Service Providers & Plugins

Service Providers are the central place for configuring and bootstrapping applications in BirJS. If you are familiar with Laravel's `ServiceProvider`, BirJS brings the exact same clean, modular architecture to modern TypeScript and Node.js.

---

## What is a Service Provider?

Service Providers allow you to encapsulate related logic (registering container bindings, setting up third-party SDKs, defining view globals, configuring event listeners, or hooking into request lifecycles) into reusable, self-contained classes.

Each Service Provider follows a two-phase lifecycle:

1. **`register()`**: Use this method to bind things into the Service Container (`app.container.singleton()` or `app.container.bind()`). In this method, you should **never** attempt to use services provided by other providers, because they may not have been registered yet.
2. **`boot()`**: Called after **all** providers have executed their `register()` methods. Here you can safely access any service, register view shared data, or initialize listeners.

---

## Creating a Service Provider

You can quickly scaffold a new Service Provider using the Bir CLI:

```bash
bir make:provider PaymentServiceProvider
```

This generates `app/providers/PaymentServiceProvider.ts`:

```typescript
import { ServiceProvider } from 'birframework';
import type { Application } from 'birframework';
import { StripeGateway } from '../services/StripeGateway.js';

export class PaymentServiceProvider extends ServiceProvider {
  /**
   * Register container bindings.
   */
  public register(): void {
    this.app.container.singleton('payment.gateway', () => {
      const apiKey = process.env.STRIPE_SECRET_KEY || '';
      return new StripeGateway(apiKey);
    });
  }

  /**
   * Bootstrap services after all providers are registered.
   */
  public boot(): void {
    // You can share data with views, attach events, etc.
    console.log('[PaymentServiceProvider] Booted successfully.');
  }
}
```

---

## Registering Providers in Your Application

You can register Service Providers directly on your `Application` instance:

```typescript
// app.ts or bootstrap/app.ts
import { Application } from 'birframework';
import { PaymentServiceProvider } from './app/providers/PaymentServiceProvider.js';

const app = new Application();

// Register the provider
app.register(PaymentServiceProvider);

export default app;
```

### Accessing Registered Services from Container

Anywhere in your controllers or middleware:

```typescript
// app/controllers/CheckoutController.ts
import type { Context } from 'birframework';
import { StripeGateway } from '../services/StripeGateway.js';

export class CheckoutController {
  async process(ctx: Context) {
    const gateway = ctx.app.container.make<StripeGateway>('payment.gateway');
    const result = await gateway.charge(ctx.input('amount'));
    return ctx.json({ success: true, result });
  }
}
```

---

## Functional Plugins (Micro-Modules)

If you have lightweight logic or want to publish a third-party npm package for BirJS, you can use **functional plugins**:

```typescript
import type { Application } from 'birframework';

export function myAnalyticsPlugin(app: Application, options: { trackingId: string }) {
  // Hook into router or add global middleware
  app.use(async (ctx, next) => {
    ctx.set('X-Tracking-ID', options.trackingId);
    await next();
  });
}
```

Registering a functional plugin:

```typescript
app.plugin(myAnalyticsPlugin, { trackingId: 'GA-999999' });
```

---

## Built-In Provider Lifecycle Hooks

Service providers have full access to:
* `this.app`: The main `Application` instance.
* `this.app.container`: Dependency injection and inversion-of-control container.
* `this.app.router`: Route definitions and groups.
* `this.app.use()`: Global middleware registration.

```typescript
export class ViewServiceProvider extends ServiceProvider {
  public register(): void {
    // Register custom helper
  }

  public boot(): void {
    // Attach default response headers or listen for events
    this.app.on('app:ready', () => {
      console.log('App is completely ready to receive traffic');
    });
  }
}
```
