# Events & Listeners

BirFramework provides an asynchronous, type-safe **Event** and **Listener** system. Events serve as a great way to decouple various aspects of your application, since a single event can have multiple listeners that don't depend on each other.

---

## 1. Scaffolding Events & Listeners

Generate an event and a corresponding listener using the CLI:

```bash
npx birframework make:event UserRegistered
npx birframework make:listener SendWelcomeEmail --event UserRegistered
```

### Event Definition (`app/events/UserRegistered.ts`)

```typescript
import { User } from '../models/User.js';

export class UserRegistered {
  constructor(public user: User) {}
}

export default UserRegistered;
```

### Listener Definition (`app/listeners/SendWelcomeEmail.ts`)

```typescript
import { UserRegistered } from '../events/UserRegistered.js';
import { Mail } from 'birframework';

export class SendWelcomeEmail {
  public async handle(event: UserRegistered): Promise<void> {
    await Mail.to(event.user.email).send({
      subject: 'Welcome to BirFramework!',
      html: `<h1>Hello, ${event.user.name}!</h1><p>Thanks for joining us.</p>`,
    });
  }
}

export default SendWelcomeEmail;
```

---

## 2. Registering Listeners

Register listeners anywhere in your application boot lifecycle (such as `app.ts` or a service provider):

```typescript
import { Event } from 'birframework';
import { UserRegistered } from './events/UserRegistered.js';
import { SendWelcomeEmail } from './listeners/SendWelcomeEmail.js';

// Register class listener
Event.listen(UserRegistered, SendWelcomeEmail);

// Or register an inline callback function
Event.listen(UserRegistered, async (event) => {
  console.log(`User created with ID: ${event.user.id}`);
});

// Or use string events with wildcards
Event.listen('order.*', (data) => {
  console.log('Order event caught:', data);
});
```

---

## 3. Dispatching Events

Dispatch events using the `Event.dispatch()` facade:

```typescript
import { Event } from 'birframework';
import { UserRegistered } from './events/UserRegistered.js';

// Dispatch a class event
const user = await User.create({ name: 'John Doe', email: 'john@example.com' });
await Event.dispatch(new UserRegistered(user));

// Dispatch a named string event with payload
await Event.dispatch('order.completed', { orderId: 452, amount: 99.0 });
```

### Stopping Early with `until`

Use `Event.until()` to stop dispatching as soon as the first listener returns a non-null result:

```typescript
const result = await Event.until('payment.verify', { cardToken: 'tok_123' });
if (result?.approved) {
  // Process approved payment
}
```

---

## 4. Testing with `Event.fake()`

When writing automated tests, you often want to verify that an event was fired without actually triggering heavy listeners (like sending emails or external webhooks). BirFramework includes testing utilities inspired by Laravel:

```typescript
import { test } from 'node:test';
import assert from 'node:assert';
import { Event } from 'birframework';
import { UserRegistered } from '../app/events/UserRegistered.js';

test('registering a user dispatches UserRegistered event', async () => {
  // 1. Fake the event dispatcher
  Event.fake();

  // 2. Perform the action
  await registerUserAction({ name: 'Jane', email: 'jane@example.com' });

  // 3. Assert the event was dispatched
  Event.assertDispatched(UserRegistered);

  // 4. Assert with callback payload inspection
  Event.assertDispatched(UserRegistered, (event) => {
    return event.user.email === 'jane@example.com';
  });

  // 5. Assert unexpected event was not dispatched
  Event.assertNotDispatched('user.deleted');

  // 6. Restore real dispatching
  Event.restore();
});
```
