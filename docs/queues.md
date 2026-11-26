# Background Queues

Offload time-consuming tasks — such as sending emails, image resizing, or AI processing — to background queue workers.

---

## Defining a Job

Generate a new job class using the CLI:

```bash
npx birframework make:job SendWelcomeEmailJob
```

Implement the `handle()` method:

```ts
// app/jobs/SendWelcomeEmailJob.ts
import { Job } from 'birframework';
import { Mail } from 'birframework';

export class SendWelcomeEmailJob extends Job {
  constructor(public user: { name: string; email: string }) {
    super();
  }

  public async handle() {
    await Mail.to(this.user.email).raw('<p>Welcome to BirJS.</p>', {
      subject: 'Welcome to BirJS',
    });
  }
}
```

---

## Dispatching Jobs

Dispatch jobs from your controllers or services:

```ts
import { dispatch } from 'birframework';
import { SendWelcomeEmailJob } from '../jobs/SendWelcomeEmailJob.ts';

// Dispatch immediately to default queue
await dispatch(new SendWelcomeEmailJob(user));

// Dispatch with delay
await dispatch(new SendWelcomeEmailJob(user).delay(60));
```

---

## Running the Queue Worker

Start processing queued jobs in the background:

```bash
npx birframework queue:work
```

The worker continuously polls the queue table, executes job `handle()` methods, and manages retry attempts with retries on failures.

---

## Failed Jobs & Retry Management

When a job exceeds its maximum retry attempts (`tries`), it is automatically recorded in the `_failed_jobs` table instead of being discarded:

```bash
# List all failed jobs with timestamps and IDs
npx bir queue:failed

# Retry a specific failed job or all failed jobs
npx bir queue:retry 42
npx bir queue:retry all

# Clear the failed jobs table
npx bir queue:flush
```

## Register jobs in the worker process

Create `app/jobs/index.ts` (or `.js`) and register each job class. The CLI worker imports this file before processing persisted jobs.

```ts
import { Queue } from 'birframework';
import { SendWelcomeEmailJob } from './SendWelcomeEmailJob.js';

Queue.register(SendWelcomeEmailJob);
```

Job properties are persisted as JSON. Use serializable values and resolve database records inside `handle()` when fresh data is needed. Delay values are seconds.
