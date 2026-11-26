# BirFramework application guide

This guide describes the local framework API. Check the installed package version and its declarations before using an API from another release.

## Runtime and entry points

Use Node.js 22.5 or later. Create a project with `npx birframework new my-app --ts --tailwind --inertia`. Use --js for JavaScript or --server-rendered for server-rendered views. Generate APP_KEY with `npx bir key:generate`.

An Application can register middleware and routes. Keep bootstrap export separate from the entry that calls listen when importing it into tests. app.serverless() returns a serverless handler.

## HTTP

Import Context from birframework. Read input with `await ctx.body()` and validate with `await ctx.validate(rules)`. ctx.params contains path values and ctx.query contains query values. Respond with ctx.json(data, status), ctx.text(), ctx.html(), ctx.redirect(), ctx.inertia(), or ctx.render(). Set response headers with ctx.header(name, value).

```ts
import { Route } from 'birframework';

Route.post('/contact', async (ctx) => {
  const data = await ctx.validate({ email: 'required|email' });
  return ctx.json({ email: data.email }, 201);
});
```

## Middleware and sessions

The middleware signature is (ctx: Context, next: Next). Import Context and Next as types. Await next(). Register sessionMiddleware() before using ctx.session or csrf(). Pass csrfToken(ctx) to page props and include a hidden _token input in forms or X-CSRF-TOKEN in requests.

FileSessionStore takes a directory string. sessionMiddleware({ driver: 'file', storeDir: 'storage/framework/sessions' }) selects it directly. An in-memory store is process-local. Serverless /tmp storage is instance-local.

## Models and database

```ts
import { Model } from 'birframework';

export class User extends Model {
  static table = 'users';
  static fillable = ['name', 'email'];
}

const users = await User.query().orderBy('id', 'desc').get();
const page = await User.paginate({ page: 1, perPage: 15 });
console.log(page.data, page.meta.total);
```

The default connection reads DB_CONNECTION and DB_DATABASE. PostgreSQL and MySQL also read DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, or DATABASE_URL. Install pg or mysql2 for those drivers. DB.raw(sql, bindings) queries SQL. DB.execute performs writes. DB.table(name) returns a query builder. DB.transaction(async () => ...) manages a transaction.

Migrations export up/down functions or a default object/class with up/down. Use Schema.create and Blueprint column helpers. Column defaults use .default(value).

## Authentication

Auth.attempt(ctx, credentials, User) requires the user model. Auth.user(ctx, User) resolves the current user. Use auth() middleware for access checks. Model fillable and guarded are static properties.

## Pages and components

Inertia pages live in views/pages and use ctx.inertia('Page', props). Server-rendered views use ctx.render('View', props). Both use Preact TSX/JSX. Reusable components live in views/components. Browser events require hydration. Access browser globals in handlers or effects.

Import Link, router, useForm, usePage, and Head from the generated resources/js/bir-inertia module using the correct relative path. Use persistent Page.layout only for UI that should remain mounted. Register birVite() in Vite plugins to discover the development asset port. Production assets use the build manifest.

## Jobs and scheduling

Dispatch with dispatch(new MyJob()) and delay with .delay(seconds). Register job classes through Queue.register(MyJob) in app/jobs/index.ts or .js so the worker can deserialize them. Start the worker with npx bir queue:work.

Import schedule definitions in the same process that calls Schedule.work(). The schedule CLI does not automatically discover application definitions. Use implemented interval helpers or dailyAt. Cross-process overlap locks require shared filesystem storage.

## Mail and storage

Mail.to(address).send() accepts a Mailable. For HTML strings use Mail.to(address).raw(html, { subject }). Mailable.view returns a promise, so content can be async. Escape user-controlled HTML text. Storage.disk(name) selects local, public, or configured cloud storage.

## Tests and documentation

Use node:test and createTestClient for HTTP tests. Close the client after tests. Import a bootstrap Application without opening a listener. Read the topic documentation for configuration and complete examples. Avoid invented APIs and performance guarantees.
