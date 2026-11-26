# Directory Structure

The generated structure depends on language and rendering profile. The following tree combines the default Inertia directories with optional application directories. Create and import optional configuration and route files explicitly.

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
│   └── providers/         # Optional service providers
├── config/                # Optional, explicitly imported
│   ├── app.ts             # App-wide Configuration
│   ├── database.ts        # Database Connections & Drivers
│   └── queue.ts           # Queue Driver Settings
├── database/
│   ├── migrations/        # Incremental Schema Migrations
│   └── seeders/           # Database Test Seeders
├── public/                # Static Assets (Images, Favicons, CSS)
├── routes/
│   ├── web.ts             # Browser Web Routes (HTML Views)
│   └── api.ts             # Optional, import it from bootstrap
├── views/
│   ├── layouts/           # Shared TSX/JSX layouts
│   ├── components/        # Reusable Preact components
│   └── pages/
│       └── Welcome.tsx   # Inertia page
├── storage/               # File Storage, Logs, and SQLite DBs
├── .env                   # Local Environment Variables
├── app.ts                 # Application Bootstrap Entrypoint
└── package.json
```

---

## Key Directories Explained

### `app/controllers/`
Houses your HTTP controllers. Controllers group related request handling logic, interact with models, and return JSON responses or rendered Preact views.

### `app/models/`
Defines your database models extending `Model`. Each model provides active record query building, relationships, validation, and serialization.

### `database/migrations/`
Version-controlled database schema changes. Migrations let you incrementally alter tables and roll back changes across environments.

### `views/`
Holds Preact TSX/JSX views. Inertia pages live in `views/pages/`, shared layouts in `views/layouts/`, and reusable components in `views/components/`.

### `storage/`
Stores uploaded files, temporary cache, job locks, and default SQLite databases (`storage/database.sqlite`).
