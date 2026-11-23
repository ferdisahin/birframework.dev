# CLI Command Reference

BirFramework provides an artisan-style command-line tool `bir` for code generation, migrations, worker daemons, and project management.

---

## Project Scaffolding

```bash
# Interactive new project wizard
npx birframework new <project-name>

# Headless options
npx birframework new <project-name> --ts --tailwind
npx birframework new <project-name> --js --css
```

---

## Code Generators (`make:*`)

Generate boilerplate code following framework architectural patterns:

| Command | Description | Output Location |
| --- | --- | --- |
| `bir make:controller <Name>` | Creates a controller class | `app/controllers/<Name>.ts` |
| `bir make:model <Name>` | Creates an Active Record Model | `app/models/<Name>.ts` |
| `bir make:migration <Name>` | Creates a timestamped migration | `database/migrations/<timestamp>_<Name>.ts` |
| `bir make:middleware <Name>` | Creates a custom middleware | `app/middleware/<Name>.ts` |
| `bir make:job <Name>` | Creates an asynchronous queue job | `app/jobs/<Name>.ts` |
| `bir make:mail <Name>` | Creates a mailable email class | `app/mail/<Name>.ts` |
| `bir make:seeder <Name>` | Creates a database seeder class | `database/seeders/<Name>.ts` |
| `bir make:factory <Name>` | Creates a model factory with Faker | `database/factories/<Name>.ts` |
| `bir make:event <Name>` | Creates an event class | `app/events/<Name>.ts` |
| `bir make:listener <Name> [--event]` | Creates an event listener class | `app/listeners/<Name>.ts` |
| `bir make:auth` | Scaffolds complete Breeze-style auth | Models, Controllers, Views, Migrations |

---

## Database & Migrations

```bash
# Run all outstanding migrations
bir migrate

# Roll back the most recent migration batch
bir migrate:rollback

# Drop all tables and re-run all migrations
bir migrate:fresh

# Seed the database with test records
bir db:seed
```

---

## Daemons & Development

```bash
# Start background queue processing worker
bir queue:work

# Start task scheduler daemon
bir schedule:work

# Scaffold authentication controllers and views
bir make:auth
```
