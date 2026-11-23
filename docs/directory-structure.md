# Directory Structure

BirJS enforces a clean, modular directory structure that scales effortlessly from tiny microservices to large enterprise monoliths.

---

## Directory Overview

```
my-bir-app/
├── app/
│   ├── controllers/       # HTTP Request Handlers
│   ├── models/            # Active Record ORM Models
│   ├── middleware/        # HTTP Middleware Pipeline
│   ├── jobs/              # Asynchronous Queue Jobs
│   ├── mail/              # Mailable Email Classes
│   └── commands/          # Custom CLI Commands
├── config/
│   ├── app.ts             # App-wide Configuration
│   ├── database.ts        # Database Connections & Drivers
│   └── queue.ts           # Queue Driver Settings
├── database/
│   ├── migrations/        # Incremental Schema Migrations
│   └── seeders/           # Database Test Seeders
├── public/                # Static Assets (Images, Favicons, CSS)
├── routes/
│   ├── web.ts             # Browser Web Routes (HTML Views)
│   └── api.ts             # REST API Routes (JSON)
├── views/
│   ├── layouts/           # Master Blade Layouts (<x-layouts.app>)
│   ├── components/        # Reusable UI Blade Components
│   └── welcome.html       # View Templates
├── storage/               # File Storage, Logs, and SQLite DBs
├── .env                   # Local Environment Variables
├── app.ts                 # Application Bootstrap Entrypoint
└── package.json
```

---

## Key Directories Explained

### `app/controllers/`
Houses your HTTP controllers. Controllers group related request handling logic, interact with models, and return JSON responses or rendered Blade views.

### `app/models/`
Defines your database models extending `Model`. Each model provides active record query building, relationships, validation, and serialization.

### `database/migrations/`
Version-controlled database schema changes. Migrations let you incrementally alter tables and roll back changes across environments.

### `views/`
Holds your Blade-like HTML templates. BirJS automatically resolves layout components in `views/layouts/` and UI components in `views/components/`.

### `storage/`
Stores uploaded files, temporary cache, job locks, and default SQLite databases (`storage/database.sqlite`).
