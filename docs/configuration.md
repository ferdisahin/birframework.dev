# Configuration and Environment

BirJS loads a root `.env` file on framework import. Existing process environment values take precedence. Environment values are strings, so convert numbers and booleans explicitly.

```ini
NODE_ENV=development
PORT=3000
DB_CONNECTION=sqlite
DB_DATABASE=storage/database.sqlite
CACHE_STORE=memory
```

Generate a private application key with `npx bir key:generate`.

## Reading values

```ts
const port = Number(process.env.PORT) || 3000;
const debug = process.env.APP_DEBUG === 'true';
const name = process.env.APP_NAME || 'My App';
```

## Application configuration

`Config` provides a process-local configuration store. Import your configuration files explicitly and register their values during bootstrap. The database driver reads DB_* environment variables directly.

```ts
import { Config, config } from 'birframework';

Config.set('app.name', process.env.APP_NAME || 'My App');
const name = config<string>('app.name');
```

Application registers default memory sessions and security headers. Configure persistent sessions and additional middleware explicitly. An environment variable alone does not install middleware. Vite can discover its listening address using `birVite()`. See [Development server](/docs/dev-server).
