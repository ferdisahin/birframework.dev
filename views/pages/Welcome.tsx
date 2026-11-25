import { useState } from 'preact/hooks';
import { Head, Link } from '../../resources/js/bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

export default function Welcome({ version, nodeVersion }: { version: string; nodeVersion: string }) {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard?.writeText('npx birframework new my-app');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <Head title={`BirJS v${version} — Full-Stack TypeScript Framework`} />

      {/* Hero Section */}
      <section class="relative pt-20 sm:pt-32 pb-20 border-b border-zinc-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto px-6">
          <div class="max-w-3xl">
            <Link
              href="/docs/installation"
              class="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 transition mb-6"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500" />
              <span class="font-medium">BirJS v{version} is now available</span>
              <span class="text-zinc-400 dark:text-zinc-600">&rarr;</span>
            </Link>

            <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.05]">
              The full-stack framework for TypeScript artisans.
            </h1>

            <p class="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Laravel backend ergonomics paired with Unified Preact + Inertia + SSR and sub-millisecond V8 speed. ActiveRecord ORM, persistent sessions, background queues, WebSockets, and Brotli compression built in.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex items-center justify-between bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-lg text-xs text-zinc-900 dark:text-zinc-200 min-w-[280px]">
                <div class="flex items-center gap-2">
                  <span class="text-zinc-400 select-none">$</span>
                  <span class="select-all font-medium">npx birframework new my-app</span>
                </div>
                <button
                  type="button"
                  onClick={copyInstall}
                  class="text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-[11px] pl-3 border-l border-zinc-300 dark:border-zinc-700 font-medium transition cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <Link
                href="/docs/installation"
                class="px-5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Read the Docs</span>
                <span>&rarr;</span>
              </Link>

              <a
                href="https://github.com/ferdisahin/BirFramework"
                target="_blank"
                class="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Metrics Strip */}
          <div class="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
            <div>
              <div class="text-zinc-500">Runtime</div>
              <div class="mt-1 font-bold text-zinc-900 dark:text-white">Node.js {nodeVersion}</div>
            </div>
            <div>
              <div class="text-zinc-500">Frontend Stack</div>
              <div class="mt-1 font-bold text-zinc-900 dark:text-white">Preact + Inertia + SSR</div>
            </div>
            <div>
              <div class="text-zinc-500">HTTP Throughput</div>
              <div class="mt-1 font-bold text-emerald-500">5,300+ req/s SSR</div>
            </div>
            <div>
              <div class="text-zinc-500">Release</div>
              <div class="mt-1 font-bold text-zinc-900 dark:text-white">v{version}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" class="py-20 border-b border-zinc-200 dark:border-zinc-800">
        <div class="max-w-7xl mx-auto px-6">
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Everything you need for production
          </h2>
          <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Zero-bloat TypeScript primitives designed for real SaaS, e-commerce, and high-traffic APIs.
          </p>

          <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {[
              {
                title: 'Unified Inertia + Preact + SSR',
                desc: 'Persistent layouts (Page.layout), useForm() with FormData uploads, <Head> SEO meta, and scroll preservation.',
                href: '/docs/inertia',
              },
              {
                title: 'Multi-Driver ORM & Locking',
                desc: 'SQLite, PostgreSQL, and MySQL with QueryBuilder, relationships, migrations, and pessimistic .forUpdate() row locks.',
                href: '/docs/database',
              },
              {
                title: 'Persistent Auth & Sessions',
                desc: 'Cookie sessions backed by Memory, FileSessionStore, or DatabaseSessionStore across restarts and workers.',
                href: '/docs/auth',
              },
              {
                title: 'HTTP Range, ETag & Compression',
                desc: 'Built-in Brotli/Gzip compress() middleware, 206 Partial Content media streaming, and ctx.fileStream().',
                href: '/docs/middleware',
              },
              {
                title: 'Cross-Process Task Scheduler',
                desc: 'Fluent cron scheduling with atomic file locks via withoutOverlapping() for multi-worker safety.',
                href: '/docs/scheduler',
              },
              {
                title: 'Queues, WebSockets & Cache',
                desc: 'Background job workers, native WebSocket broadcasting, and Memory/File/Redis cache drivers.',
                href: '/docs/cache',
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 hover:border-emerald-500/50 transition block"
              >
                <h3 class="font-bold text-zinc-950 dark:text-white">{card.title}</h3>
                <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section id="benchmarks" class="py-20">
        <div class="max-w-7xl mx-auto px-6">
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Production Benchmarks
          </h2>
          <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Real-world comparison on the exact same TLD comparison workload (25 concurrent connections).
          </p>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div class="text-zinc-500">Home SSR (/)</div>
              <div class="mt-2 text-3xl font-extrabold text-emerald-500 tabular-nums">5,352 req/s</div>
              <div class="mt-1 text-zinc-500">4.28 ms avg vs Next.js 1,790 req/s</div>
            </div>
            <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div class="text-zinc-500">JSON API (/api/prices)</div>
              <div class="mt-2 text-3xl font-extrabold text-emerald-500 tabular-nums">582 req/s</div>
              <div class="mt-1 text-zinc-500">Brotli compressed 653 KB payload</div>
            </div>
            <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div class="text-zinc-500">Vite Production Build</div>
              <div class="mt-2 text-3xl font-extrabold text-emerald-500 tabular-nums">~460 ms</div>
              <div class="mt-1 text-zinc-500">Tree-shaken Preact + Tailwind chunks</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Welcome.layout = (page: any) => <AppLayout>{page}</AppLayout>;
