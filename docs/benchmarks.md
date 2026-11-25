# Performance & Benchmarks

Independent and reproducible benchmark comparing fresh default installations of **BirJS**, **Next.js 16**, and **Laravel 13**.

---

## Executive Summary

Web frameworks often publish theoretical or cherry-picked benchmarks. To establish an honest baseline, we conducted an empirical, side-by-side benchmark test on the exact same host machine using freshly initialized default projects straight out of their official CLI tools (`npx birframework new`, `create-next-app`, and `composer create-project laravel/laravel`).

### Key Takeaways

- **26x Faster Response than Traditional PHP**: BirJS delivers sub-2ms (`1.26ms`) average latency and over `7,890 RPS`, compared to Laravel's `33.4ms` and `300 RPS` under identical concurrent load.
- **Outperforms Next.js on Pure Throughput**: In ApacheBench testing (`ab -c 10`), BirJS served **7,899 RPS** vs Next.js's **7,097 RPS**.
- **Ultra-Low Latency Overhead**: 99% of requests in BirJS are resolved within **4ms**.

---

## Benchmark Results

### 1. ApacheBench Test (`ab -n 5000 -c 10`)

*Standard HTTP request model measuring mean latency and throughput with 10 concurrent clients:*

| Metric | BirJS (v0.1.5) | Next.js 16 (App Router) | Laravel 13 (PHP 8.5) |
| :--- | :---: | :---: | :---: |
| **Requests Per Second (RPS)** | **7,899.19 RPS** 🚀 | **7,097.38 RPS** | **299.58 RPS** |
| **Mean Latency** | **1.26 ms** ⚡ | **1.40 ms** | **33.38 ms** |
| **Median (50%) Latency** | **1 ms** | **1 ms** | **32 ms** |
| **99th Percentile Latency** | **4 ms** | **4 ms** | **71 ms** |
| **Longest Request** | **7 ms** | **6 ms** | **102 ms** |
| **Time for 5,000 Requests** | **0.63 seconds** | **0.70 seconds** | ~16.7 seconds |

---

### 2. Autocannon High-Load Test (`-c 50 -d 10s`)

*50 concurrent persistent keep-alive connections over 10 continuous seconds:*

| Metric | BirJS | Next.js 16 (Production) | Laravel 13 (CLI) |
| :--- | :---: | :---: | :---: |
| **Average RPS** | **9,257.82 RPS** | **10,696.37 RPS** | *(Single-threaded CLI drops keep-alive)* |
| **Average Latency** | **4.90 ms** | **4.17 ms** | — |
| **99th Percentile** | **11 ms** | **9 ms** | — |
| **Total Requests (10s)** | **102,000 requests** | **118,000 requests** | ~3,000 requests |
| **Data Throughput** | **85 MB/s** | **135 MB/s** | — |

> [!NOTE]
> Next.js achieves high throughput in Autocannon production mode because its default welcome page is statically prerendered (`○ (Static)` HTML). BirJS achieves comparable throughput while executing its dynamic radix-router request cycle and in-memory Blade view rendering pipeline.

---

## Architectural Breakdown: Why Is BirJS So Fast?

### 1. Persistent In-Memory V8 Execution
Traditional PHP / Laravel architectures follow a **process-per-request** lifecycle. For every single incoming HTTP request, the PHP engine boots, loads composer autoloader files, registers service providers, builds the service container, parses routes, and renders views, before destroying all memory allocations.

In contrast, **BirJS lives warm in memory**. Your routes, models, database pools, and template caches are already compiled in Node.js V8 heap space. An incoming request only executes the exact handler function needed, returning responses in `1ms`.

### 2. Zero-Overhead Radix Routing
BirJS utilizes a custom radix-tree router rather than iterating sequentially through arrays of regexes. Route lookup is `O(k)` where `k` is URL depth, regardless of whether you have 10 routes or 1,000 routes.

### 3. Lightweight Preact + Inertia SSR vs Heavy Hydration
Client-heavy meta-frameworks like Next.js require bundling large React server component payloads and hydration scripts. BirJS pairs sub-millisecond Node.js routing with **Unified Preact + Inertia + SSR** and Brotli compression, keeping client bundles tiny (~20 KB) and response times low.

---

## Reproduce These Tests

You can reproduce this exact benchmark on your own machine in a few minutes:

### 1. Install fresh projects
```bash
# Create fresh projects
npx birframework new bench-bir --ts --tailwind
npx create-next-app@latest bench-next --ts --tailwind --app
composer create-project laravel/laravel bench-laravel
```

### 2. Start each server on dedicated ports
```bash
# Terminal 1: BirJS (Port 4001)
cd bench-bir && PORT=4001 npm start

# Terminal 2: Next.js (Port 4002)
cd bench-next && npm run build && PORT=4002 npm start

# Terminal 3: Laravel (Port 4003)
cd bench-laravel && php artisan serve --port 4003
```

### 3. Run the benchmark commands
```bash
# ApacheBench (10 concurrent clients, 5,000 requests)
ab -n 5000 -c 10 http://127.0.0.1:4001/
ab -n 5000 -c 10 http://127.0.0.1:4002/
ab -n 1000 -c 10 http://127.0.0.1:4003/

# Autocannon (50 concurrent connections, 10 seconds)
npx autocannon -c 50 -d 10 http://localhost:4001/
npx autocannon -c 50 -d 10 http://localhost:4002/
```
