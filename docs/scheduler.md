# Task Scheduler

Register tasks and start the scheduler in the same process. The CLI schedule:work and schedule:run commands do not automatically import your application's schedule definitions.

## Application entry point

```ts
// app/console/scheduler.ts
import { Schedule } from 'birframework';

Schedule.call(async () => {
  console.log('Scheduled check');
}, 'Scheduled check').everyMinute();

await Schedule.work();
```

```bash
node --import tsx app/console/scheduler.ts
```

Use `Schedule.work({ once: true })` to run due tasks once. In a JavaScript project omit the tsx loader and use a .js file.

## Frequencies

Supported helpers are everySecond(), everyMinute(), everyFiveMinutes(), everyTenMinutes(), everyThirtyMinutes(), hourly(), daily(), and dailyAt('14:30'). Interval helpers measure elapsed time since the previous execution. dailyAt checks the local process time.

## Queue jobs

```ts
import { Schedule } from 'birframework';
import { BackupJob } from '../jobs/BackupJob.js';

Schedule.job(new BackupJob()).dailyAt('02:00');
```

Schedule.job dispatches to the queue. Register the class in app/jobs/index.ts and run a queue worker to execute it.

## Prevent overlap

```ts
Schedule.call(async () => {
  await synchronizeCatalog();
}, 'Synchronize catalog').everyFiveMinutes().withoutOverlapping(3600);
```

withoutOverlapping uses exclusive files under storage/framework/locks. Processes coordinate only when sharing the lock directory. A task exceeding the lock TTL can overlap a later execution. Keep descriptions stable and distinct for tasks that need independent locks.
