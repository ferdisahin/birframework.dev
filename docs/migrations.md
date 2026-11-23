# Schema & Migrations

Migrations are like version control for your database, allowing your team to define and share the application's database schema definition.

---

## Creating a Migration

Generate a new migration using the Bir CLI:

```bash
npx birframework make:migration create_posts_table
```

This creates a timestamped migration file in `database/migrations/`:

```ts
// database/migrations/2026_11_23_000001_create_posts_table.ts
import { Schema, Blueprint } from 'birframework';

export class CreatePostsTable {
  public async up() {
    await Schema.create('posts', (table: Blueprint) => {
      table.id();
      table.string('title');
      table.string('slug').unique();
      table.text('content');
      table.integer('user_id').references('id').on('users');
      table.boolean('published').defaultTo(false);
      table.timestamps();
    });
  }

  public async down() {
    await Schema.dropIfExists('posts');
  }
}
```

---

## Running Migrations

Execute all pending migrations:

```bash
npx birframework migrate
```

Roll back the last migration batch:

```bash
npx birframework migrate:rollback
```

Reset all tables and re-run migrations from scratch:

```bash
npx birframework migrate:fresh
```

---

## Available Blueprint Column Types

| Method | Type | Description |
| --- | --- | --- |
| `table.id()` | Auto-incrementing Integer | Primary key |
| `table.string(name, length?)` | `VARCHAR` | Short text column |
| `table.text(name)` | `TEXT` | Multiline content column |
| `table.integer(name)` | `INTEGER` | Integer numeric column |
| `table.boolean(name)` | `BOOLEAN` | Boolean true/false column |
| `table.timestamps()` | `DATETIME` | Adds `created_at` & `updated_at` |
