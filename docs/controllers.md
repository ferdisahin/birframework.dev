# Controllers & Actions

Controllers centralize HTTP request handling logic into dedicated classes instead of writing bloated inline route closures.

---

## Creating a Controller

Create a controller manually in `app/controllers/` or generate one with the CLI:

```bash
npx birframework make:controller UserController
```

Example controller class:

```ts
// app/controllers/UserController.ts
import type { Context } from 'birframework';
import { User } from '../models/User.ts';

export class UserController {
  /**
   * Display a listing of users.
   */
  public async index(ctx: Context) {
    const users = await User.query().orderBy('created_at', 'DESC').get();
    return ctx.render('users/index', { users });
  }

  /**
   * Display a specific user.
   */
  public async show(ctx: Context) {
    const user = await User.find(ctx.params.id);
    if (!user) {
      return ctx.notFound('User not found');
    }
    return ctx.json(user);
  }

  /**
   * Store a newly created user in storage.
   */
  public async store(ctx: Context) {
    const validated = ctx.validate({
      name: 'required|min:3',
      email: 'required|email|unique:users,email',
    });

    const user = await User.create(validated);
    return ctx.created(user);
  }
}
```

---

## Binding Controllers to Routes

Pass an instance or class action to your route definition:

```ts
// routes/web.ts
import { Route } from 'birframework';
import { UserController } from '../app/controllers/UserController.ts';

const userCtrl = new UserController();

Route.get('/users', (ctx) => userCtrl.index(ctx));
Route.get('/users/:id', (ctx) => userCtrl.show(ctx));
Route.post('/users', (ctx) => userCtrl.store(ctx));
```

---

## Context Helpers

The `Context` object passed to controller actions contains rich utility methods:

- `ctx.params`: Route parameters (`/users/:id` -> `ctx.params.id`)
- `ctx.query`: URL query string parameters (`?page=2` -> `ctx.query.page`)
- `ctx.body`: Parsed request payload (JSON or Form URL-encoded)
- `ctx.json(data, status?)`: Return JSON response
- `ctx.render(view, data?)`: Render Blade HTML template
- `ctx.redirect(url, status?)`: HTTP redirect
- `ctx.session`: Session store (get, set, flash)
