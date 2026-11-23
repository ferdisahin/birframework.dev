# API Resources & JSON Transformation

When building modern APIs, you often need an abstraction layer that sits between your database models and the JSON responses actually returned to users or frontend applications.

BirFramework's **JsonResource** provides a clean, expressive transformation layer inspired by Eloquent API Resources, enabling precise control over field exposure, relationships, pagination, and conditional attributes.

---

## 1. Creating a Resource

To create a resource, extend `JsonResource` and implement the `toArray()` method:

```typescript
import { JsonResource, type RequestContext } from 'birframework';
import type { User } from '../models/User.js';

export class UserResource extends JsonResource<User> {
  public toArray(ctx?: RequestContext) {
    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,
      created_at: this.resource.created_at,
    };
  }
}
```

---

## 2. Using Resources in Routes and Controllers

You can transform a single model or a collection of models:

### Single Model Transformation

```typescript
import { Route } from 'birframework';
import { User } from '../models/User.js';
import { UserResource } from '../resources/UserResource.js';

Route.get('/api/users/:id', async (ctx) => {
  const user = await User.find(ctx.params.id);
  if (!user) return ctx.notFound({ message: 'User not found' });

  return UserResource.make(user);
});
```

By default, single resources are wrapped inside a top-level `data` key:

```json
{
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-11-23T10:00:00.000Z"
  }
}
```

### Resource Collections

To transform an array or collection of models, use the static `collection()` method:

```typescript
Route.get('/api/users', async (ctx) => {
  const users = await User.all();
  return UserResource.collection(users);
});
```

```json
{
  "data": [
    { "id": 1, "name": "Jane Doe", "email": "jane@example.com" },
    { "id": 2, "name": "John Smith", "email": "john@example.com" }
  ]
}
```

---

## 3. Preserving Paginator Metadata

When passing a `LengthAwarePaginator` (returned by `Model.paginate()`) to `collection()`, BirFramework automatically transforms the items while preserving total counts, current page, and pagination links:

```typescript
Route.get('/api/users', async (ctx) => {
  const page = Number(ctx.query.page) || 1;
  const paginatedUsers = await User.paginate(page, 15);

  return UserResource.collection(paginatedUsers);
});
```

Response:

```json
{
  "data": [
    { "id": 1, "name": "Jane Doe", "email": "jane@example.com" }
  ],
  "meta": {
    "total": 50,
    "per_page": 15,
    "current_page": 1,
    "last_page": 4,
    "from": 1,
    "to": 15
  },
  "links": {
    "first": "?page=1",
    "last": "?page=4",
    "prev": null,
    "next": "?page=2"
  }
}
```

---

## 4. Conditional Attributes

BirFramework provides `when()` and `whenNotNull()` helpers inside `JsonResource` to include attributes only when specific conditions are met (e.g. admin privileges or non-empty relationships):

```typescript
export class UserResource extends JsonResource<User> {
  public toArray(ctx?: RequestContext) {
    const isAdmin = ctx?.session?.get('is_admin') === true;

    return {
      id: this.resource.id,
      name: this.resource.name,
      email: this.resource.email,

      // Only included if isAdmin is true
      secret_token: this.when(isAdmin, this.resource.secret_token),

      // Only included if phone is not null/undefined
      phone: this.whenNotNull(this.resource.phone),
    };
  }
}
```

---

## 5. Adding Top-Level Metadata

Attach additional root-level metadata (such as status codes, copyright, or runtime metrics) using the `.additional()` chain:

```typescript
return UserResource.make(user).additional({
  status: 'success',
  meta: {
    cached: false,
    version: '1.0',
  },
});
```

```json
{
  "data": {
    "id": 1,
    "name": "Jane Doe"
  },
  "status": "success",
  "meta": {
    "cached": false,
    "version": "1.0"
  }
}
```

---

## 6. Disabling Data Wrapping

If you prefer flat JSON output without the top-level `data` key, call `withoutWrapping()` on the resource instance:

```typescript
return UserResource.make(user).withoutWrapping();
```

Output:

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
