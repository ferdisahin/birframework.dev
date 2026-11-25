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
    await Mail.to(this.user.email).send({
      subject: `Welcome to BirJS, ${this.user.name}!`,
      view: 'emails/welcome',
      data: { user: this.user },
    });
  }
}
```

---

## Dispatching Jobs

Dispatch jobs from your controllers or services:

```ts
import { Queue } from 'birframework';
import { SendWelcomeEmailJob } from '../jobs/SendWelcomeEmailJob.ts';

// Dispatch immediately to default queue
await Queue.dispatch(new SendWelcomeEmailJob(user));

// Dispatch with delay
await Queue.later(60 * 1000, new SendWelcomeEmailJob(user));
```

---

## Running the Queue Worker

Start processing queued jobs in the background:

```bash
npx birframework queue:work
```

The worker continuously polls the queue table, executes job `handle()` methods, and manages retry attempts with exponential backoff on failures.

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
