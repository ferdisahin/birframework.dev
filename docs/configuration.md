# Configuration & Environment

BirFramework provides centralized configuration management and native `.env` parsing out of the box.

---

## Environment Variables (`.env`)

At the root of your application, the `.env` file defines your environment-specific settings:

```ini
APP_NAME=BirFramework
APP_ENV=development
APP_KEY=base64:randomGeneratedSecurityKey32Chars
APP_DEBUG=true
APP_URL=http://localhost:3000

DB_CONNECTION=sqlite
DB_DATABASE=storage/database.sqlite

SESSION_DRIVER=cookie
QUEUE_CONNECTION=database
CACHE_DRIVER=memory
```

---

## Reading Environment Values

BirFramework provides an `env()` helper that reads from `process.env` with type casting and fallback defaults:

```ts
import { env } from 'birframework';

const appName = env('APP_NAME', 'BirFramework');
const port = env('PORT', 3000);
const isDebug = env('APP_DEBUG', false);
```

---

## Centralized Config Files

Configuration files reside in the `config/` directory. Each file exports configuration options that can be accessed anywhere in your application:

```ts
// config/database.ts
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
      database: env('DB_DATABASE', 'app'),
      username: env('DB_USERNAME', 'postgres'),
      password: env('DB_PASSWORD', ''),
    },
  },
};
```
