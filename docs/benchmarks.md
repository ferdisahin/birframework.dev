# Performance Measurement

The previous comparison measured BirJS 0.1.5. Those results do not describe the current TSX/JSX rendering stack. Measure the current application in production mode and record the framework version, runtime, hardware, response size, and database workload alongside each result.

## Build and start

```bash
npm ci
npm run build
NODE_ENV=production PORT=4001 npm start
```

Configure APP_KEY and database credentials before starting. Confirm the application reports the expected port and returns the intended page.

## Measure a representative endpoint

```bash
npx autocannon -c 10 -d 30 http://127.0.0.1:4001/
```

Run a warm-up first and repeat the measurement. Record throughput, latency percentiles, error counts, and response bytes. Measure JSON endpoints and rendered pages separately. Include authentication and database queries when those are part of the real workload.

Comparisons require the same host, concurrency, duration, response content, and production setup. Publish raw outputs and exact configuration with any performance claim.
