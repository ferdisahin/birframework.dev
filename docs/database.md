# Multi-Driver Database Engine

BirFramework includes a unified database connection layer supporting SQLite, PostgreSQL, and MySQL.

---

## Configuration

Configure your database drivers in `config/database.ts`:

```ts
import { env } from 'birframework';

export default {
  default: env('DB_CONNECTION', 'sqlite'),

  connections: {
    sqlite: {
      driver: 'sqlite',
      database: env('DB_DATABASE', 'storage/database.sqlite'),
    },
    postgres: {
      driver: 'postgres',
      host: env('DB_HOST', '127.0.0.1'),
      port: env('DB_PORT', 5432),
      database: env('DB_DATABASE', 'my_app'),
      username: env('DB_USERNAME', 'postgres'),
      password: env('DB_PASSWORD', ''),
    },
  },
};
```

---

## Zero-Dependency SQLite

BirFramework uses Node's built-in `node:sqlite` engine when running on Node.js 22+. No external binary downloads, C++ node-gyp compilers, or heavy native dependencies are required.

---

## Raw Queries & Fluent Query Builder

Execute raw parameterized SQL queries or use the fluent query builder:

```ts
import { DB } from 'birframework';

// Raw parameterized query
const activeUsers = await DB.select(
  'SELECT * FROM users WHERE status = ? AND age >= ?',
  ['active', 21]
);

// Fluent query builder
const count = await DB.table('orders')
  .where('status', 'completed')
  .count();

// Transactions
await DB.transaction(async () => {
  await DB.table('accounts').where('id', 1).decrement('balance', 100);
  await DB.table('accounts').where('id', 2).increment('balance', 100);
});
```
