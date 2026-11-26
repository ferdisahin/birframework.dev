# Multi-Driver Database Engine

BirJS includes a unified database connection layer supporting SQLite, PostgreSQL, and MySQL.

---

## Configuration

The default connection reads environment variables directly.

```ini
DB_CONNECTION=sqlite
DB_DATABASE=storage/database.sqlite
```

For PostgreSQL use `DB_CONNECTION=postgres`, port 5432 and install `pg`. For MySQL use `DB_CONNECTION=mysql`, port 3306 and install `mysql2`. Both read `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`, or `DATABASE_URL`.

```bash
npm install pg
# For MySQL instead:
# npm install mysql2
```

An explicit connection uses `new DatabaseConnection({ driver, host, port, database, user, password })`. The option is `user`, while the environment variable is `DB_USERNAME`.

## Zero-Dependency SQLite

BirJS uses Node's built-in `node:sqlite` engine when running on Node.js 22+. No external binary downloads, C++ node-gyp compilers, or heavy native dependencies are required.

---

## Raw Queries & Fluent Query Builder

Execute raw parameterized SQL queries or use the fluent query builder:

```ts
import { DB } from 'birframework';

// Raw parameterized query
const activeUsers = await DB.raw(
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


## Pessimistic Row Locking (`forUpdate`)

For concurrent-safe balance, inventory, or invoice updates on PostgreSQL and MySQL, chain `.forUpdate()` inside a transaction:

```ts
await DB.transaction(async () => {
  const wallet = await DB.table('wallets')
    .where('user_id', userId)
    .forUpdate()
    .first();
  // Safe to update wallet balance
});
```

*(On SQLite, `.forUpdate()` is a safe no-op.)*
