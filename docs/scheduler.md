# Task Scheduler

BirJS includes a built-in fluent task scheduling engine, eliminating the need to configure multiple server-level OS cron entries.

---

## Defining Schedules

Register scheduled tasks in `app/console/Kernel.ts` or during application bootstrap:

```ts
// app/console/Kernel.ts
import { Schedule } from 'birframework';
import { BackupDatabaseJob } from '../jobs/BackupDatabaseJob.ts';

export function registerSchedule() {
  // Execute closure every minute
  Schedule.call(() => {
    console.log('[Schedule] Running minute check...');
  }).everyMinute();

  // Execute daily at midnight
  Schedule.call(async () => {
    await cleanOldSessions();
  }).daily();

  // Execute job every Monday at 08:00
  Schedule.job(new BackupDatabaseJob()).weeklyOn(1, '08:00');
}
```

---

## Frequency Options

| Method | Schedule Interval |
| --- | --- |
| `everyMinute()` | Runs every 60 seconds |
| `everyFiveMinutes()` | Runs every 5 minutes |
| `hourly()` | Runs at the start of every hour |
| `daily()` | Runs every day at 00:00 |
| `dailyAt('14:30')` | Runs every day at specified time |
| `weekly()` | Runs once a week on Sunday at 00:00 |
| `monthly()` | Runs on the first day of every month |

---

## Running the Scheduler

Start the scheduling daemon in your background process manager (PM2, Docker, or systemd):

```bash
npx birframework schedule:work
```

---

## Preventing Task Overlaps

If a long-running task (such as daily invoice generation or database backups) takes longer than its schedule interval, chain `.withoutOverlapping()` to skip concurrent executions until the active run finishes:

```ts
Schedule.call(async () => {
  await generateRenewalInvoices();
})
  .everyMinute()
  .withoutOverlapping();
```
