# Active Record ORM

BirJS provides an intuitive Active Record ORM inspired by Eloquent, allowing you to interact with database tables as expressive TypeScript classes.

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
  email: 'ferdi@birjs.com',
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
const user = await User.where('email', 'ferdi@birjs.com').first();
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

## Model Lifecycle Hooks

BirJS models fire lifecycle hooks allowing you to tap into the model's lifecycle: `creating`, `created`, `saving`, `saved`, `deleting`, and `deleted`.

### Instance Method Hooks

You can define lifecycle methods directly on your Model class:

```typescript
export class Article extends Model {
  // Automatically generate slugs before record creation
  public beforeCreate() {
    if (!this.attributes['slug']) {
      this.attributes['slug'] = String(this.attributes['title'])
        .toLowerCase()
        .replace(/\s+/g, '-');
    }
  }

  public afterCreate() {
    console.log(`Article #${this.id} created successfully!`);
  }
}
```

### Static Hook Listeners

```typescript
User.saving((user) => {
  // Hash passwords or format data before saving
});

User.created(async (user) => {
  // Dispatch welcome email or notifications
});
```

---

## Soft Deletes

BirJS supports non-destructive deletions using the `softDeletes` property:

```typescript
export class Post extends Model {
  static override softDeletes = true;
}
```

### How Soft Deletes Work

When `softDeletes` is enabled:
- Calling `post.delete()` sets `deleted_at` to the current timestamp instead of removing the row from the database.
- Standard queries (`Post.all()`, `Post.find()`, `Post.where()`) automatically exclude soft-deleted records.

```typescript
const post = await Post.find(1);
await post.delete(); // Soft-deleted (deleted_at set)

console.log(post.trashed()); // true

// Will return null because record is trashed:
const normal = await Post.find(1);

// Query including soft-deleted records:
const allWithDeleted = await Post.withTrashed().where('author_id', 5).get();

// Query only soft-deleted records:
const trashedOnly = await Post.onlyTrashed().get();

// Restore a soft-deleted record:
await post.restore();

// Permanently remove from database:
await post.forceDelete();
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
