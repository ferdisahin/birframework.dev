# Active Record ORM

BirFramework provides an intuitive Active Record ORM inspired by Eloquent, allowing you to interact with database tables as expressive TypeScript classes.

---

## Defining a Model

Create model classes extending `Model`:

```ts
// app/models/User.ts
import { Model } from 'birframework';
import { Post } from './Post.ts';

export class User extends Model {
  // Table name (defaults to snake_case plural of class name: 'users')
  protected static table = 'users';

  // Primary key (defaults to 'id')
  protected static primaryKey = 'id';

  // Relationships
  public posts() {
    return this.hasMany(Post, 'user_id');
  }
}
```

---

## CRUD Operations

### Inserting Records

```ts
const user = await User.create({
  name: 'Ferdi Sahin',
  email: 'ferdi@birframework.dev',
  role: 'admin',
});
```

### Finding & Querying

```ts
// Find by primary key
const user = await User.find(1);

// Where clauses & chaining
const admins = await User.where('role', 'admin')
  .where('is_active', true)
  .orderBy('created_at', 'DESC')
  .get();

// First matching record
const user = await User.where('email', 'ferdi@birframework.dev').first();
```

### Updating Records

```ts
const user = await User.find(1);
if (user) {
  user.name = 'Updated Name';
  await user.save();
}
```

### Deleting Records

```ts
const user = await User.find(1);
if (user) {
  await user.delete();
}
```

---

## Pagination

Easily paginate results in your controllers:

```ts
// Returns LengthAwarePaginator with items and page metadata
const paginatedUsers = await User.paginate({ page: 1, perPage: 15 });

console.log(paginatedUsers.total);        // Total count
console.log(paginatedUsers.currentPage);  // 1
console.log(paginatedUsers.data);         // Current page items
```
