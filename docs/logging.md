# Structured Logging & Pail

BirJS includes a unified, structured logging architecture designed for high-performance applications. It pairs file-based persistence with **Bir Pail**, an interactive CLI log tailer that streams colorized logs in real time.

---

## The Log Facade

Import the `Log` facade from `birframework` to record runtime events, security warnings, or diagnostic traces:

```ts
import { Log } from 'birframework';

// Informational events
Log.info('Order successfully processed', { orderId: 8492, amount: 149.99 });

// Warning states
Log.warning('Rate limit threshold approached', { ip: '192.168.1.1', attempts: 55 });

// Critical errors and exceptions
Log.error('Payment gateway connection failed', { gateway: 'stripe', error: err.message });

// Debug details (muted in production)
Log.debug('Cache query miss', { key: 'users:profile:42' });
```

---

## Log Levels

BirJS implements standard RFC 5424 log severity levels:

| Level | Method | Typical Use Case |
| :--- | :--- | :--- |
| **Emergency** | `Log.emergency(msg, ctx)` | System is unusable |
| **Alert** | `Log.alert(msg, ctx)` | Immediate action required |
| **Critical** | `Log.critical(msg, ctx)` | Critical system or database conditions |
| **Error** | `Log.error(msg, ctx)` | Runtime errors that do not require immediate action |
| **Warning** | `Log.warning(msg, ctx)` | Exceptional occurrences that are not errors |
| **Notice** | `Log.notice(msg, ctx)` | Normal but significant events |
| **Info** | `Log.info(msg, ctx)` | Interesting runtime events (user login, job dispatched) |
| **Debug** | `Log.debug(msg, ctx)` | Detailed debug information for development |

---

## Log Storage & File Rotation

By default, all log entries are appended asynchronously to:

```
storage/logs/bir.log
```

Log entries are formatted with ISO-8601 timestamps, log levels, and stringified JSON contextual data:

```text
[2026-11-24T16:20:00.123Z] [INFO] [HTTP] GET /api/v1/users 200 - 2.4ms {"ip":"::1"}
[2026-11-24T16:20:05.456Z] [ERROR] [Queue] Job SendInvoiceJob failed {"attempt":3,"error":"Timeout"}
```

---

## Bir Pail: Real-Time Log Streaming

Inspired by Laravel Pail, BirJS includes **Bir Pail**, a zero-dependency CLI log tailer that continuously monitors `storage/logs/bir.log` and renders incoming events with distinct ANSI badges and clean formatting:

```bash
npx bir pail
# or using the shortcut
npx bir logs
```

### Visual Category Badges

Bir Pail automatically recognizes the source and categorizes your logs with high-contrast color badges:

* <span style="color:#38bdf8;font-weight:bold;">[HTTP]</span> Cyan: Incoming HTTP requests, routes, status codes, and execution latency.
* <span style="color:#a855f7;font-weight:bold;">[Queue]</span> Purple: Job processing, retries, completions, and queue failures.
* <span style="color:#f43f5e;font-weight:bold;">[Error]</span> Rose: Uncaught exceptions, database connectivity drops, and 500 responses.
* <span style="color:#fbbf24;font-weight:bold;">[Schedule]</span> Amber: Cron task triggers and background scheduler executions.
* <span style="color:#10b981;font-weight:bold;">[Mail]</span> Emerald: Outgoing transactional emails and mailable deliveries.

---

## Dev Dashboard Integration

Bir Pail is integrated into the default development workflow. When you run:

```bash
npm run dev
```

The 4-service concurrent runner launches:
1. `server`: Your HTTP application
2. `queue`: The background queue worker
3. `logs`: **Bir Pail** live log streamer
4. `vite`: Frontend assets dev server

All four streams output to a single unified terminal window with dedicated color tags.
