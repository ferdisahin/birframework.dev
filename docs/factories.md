# Model Factories & Database Seeding

When developing applications and writing automated tests, generating realistic test data quickly is essential. BirJS provides a built-in **Factory** system and lightweight **Faker** utility, completely eliminating the need for bulky third-party mock libraries.

---

## 1. Creating a Factory

Scaffold a new factory using the BirJS CLI:

```bash
npx birframework make:factory UserFactory
```

This generates `database/factories/UserFactory.ts`:

```typescript
import { Factory, type Faker } from 'birframework';
import { User } from '../../app/models/User.js';

export const UserFactory = Factory.define(User, (faker: Faker) => ({
  name: faker.name(),
  email: faker.email(),
  role: 'member',
  created_at: new Date(),
  updated_at: new Date(),
}));

export default UserFactory;
```

---

## 2. The Built-in Faker Utility

The `Faker` generator provides common fake data generators with zero external dependencies:

```typescript
faker.name()               // "Jane Miller"
faker.firstName()          // "Alex"
faker.lastName()           // "Taylor"
faker.email('example.com') // "jane.miller84@example.com"
faker.username()           // "alex_dev_92"
faker.number(10, 100)      // 42
faker.boolean()            // true / false
faker.uuid()               // "a3f5c1d2e8b4..."
faker.word()               // "lorem"
faker.sentence()           // "Quis nostrud exercitation ullamco laboris."
faker.paragraph()          // Full multi-sentence paragraph
faker.pick(['a', 'b'])     // Random element from array
```

---

## 3. Using Factories

### Generating In-Memory Attributes (`raw`)

Generate plain JavaScript objects without touching the database:

```typescript
const attributes = UserFactory.raw({ role: 'admin' });
// { name: "Jane Miller", email: "...", role: "admin", ... }
```

### Creating In-Memory Model Instances (`make`)

Instantiate unpersisted `Model` instances:

```typescript
const user = UserFactory.make({ role: 'admin' });
console.log(user.name); // Access model properties directly
```

### Persisting to the Database (`create`)

Save the generated model directly to your configured SQL database (SQLite, PostgreSQL, MySQL):

```typescript
const user = await UserFactory.create();
console.log(user.id); // Primary key assigned by database
```

### Generating Multiple Records (`count`)

Combine `.count()` with `.make()` or `.create()`:

```typescript
// Create 20 users in memory
const users = UserFactory.count(20).make();

// Insert 50 users into the database
const persistedUsers = await UserFactory.count(50).create();
```

---

## 4. Factory States

Define reusable state modifications for specific scenarios (e.g. VIP customers, unverified emails, admins):

```typescript
export const UserFactory = Factory.define(User, (faker) => ({
  name: faker.name(),
  email: faker.email(),
  role: 'member',
  email_verified: true,
}))
  .state('admin', { role: 'admin' })
  .state('unverified', { email_verified: false });

// Usage:
const admin = await UserFactory.state('admin').create();
const unverifiedUsers = await UserFactory.state('unverified').count(5).create();
```

---

## 5. Database Seeders

BirJS seeders allow you to populate your database with initial data or realistic mock records:

```bash
npx birframework make:seeder DatabaseSeeder
```

In `database/seeders/DatabaseSeeder.ts`:

```typescript
import { Seeder } from 'birframework';
import { UserFactory } from '../factories/UserFactory.js';

export class DatabaseSeeder extends Seeder {
  public async run(): Promise<void> {
    // Seed 1 default superadmin
    await UserFactory.create({
      name: 'Super Admin',
      email: 'admin@birjs.com',
      role: 'admin',
    });

    // Seed 50 test users
    await UserFactory.count(50).create();
  }
}

export default DatabaseSeeder;
```

Run seeders at any time with:

```bash
npx birframework db:seed
```
