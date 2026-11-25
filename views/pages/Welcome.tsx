import { useState } from 'preact/hooks';
import { Head, Link } from '../../resources/js/bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

const CODE_TABS = [
  {
    id: 'route',
    label: 'routes/web.ts',
    lines: [
      { n: 1, text: "import { Route, Context } from 'birframework';" },
      { n: 2, text: "import { Post } from '../app/models/Post.js';" },
      { n: 3, text: '' },
      { n: 4, text: "Route.get('/posts/:slug', async (ctx: Context) => {" },
      { n: 5, text: "  const post = await Post.where('slug', ctx.params.slug).firstOrFail();" },
      { n: 6, text: '' },
      { n: 7, text: "  return ctx.inertia('PostShow', { post }, {" },
      { n: 8, text: '    title: post.title,' },
      { n: 9, text: '    canonical: `https://birjs.com/posts/${post.slug}`,' },
      { n: 10, text: '  });' },
      { n: 11, text: '});' },
    ],
  },
  {
    id: 'page',
    label: 'views/pages/PostShow.tsx',
    lines: [
      { n: 1, text: "import { Head, useForm } from '../../resources/js/bir-inertia';" },
      { n: 2, text: "import { AppLayout } from '../layouts/AppLayout';" },
      { n: 3, text: '' },
      { n: 4, text: 'export default function PostShow({ post }: { post: any }) {' },
      { n: 5, text: "  const form = useForm({ body: '' });" },
      { n: 6, text: '' },
      { n: 7, text: '  return (' },
      { n: 8, text: '    <article class="max-w-2xl mx-auto py-12">' },
      { n: 9, text: '      <Head title={post.title} />' },
      { n: 10, text: '      <h1>{post.title}</h1>' },
      { n: 11, text: '    </article>' },
      { n: 12, text: '  );' },
      { n: 13, text: '}' },
      { n: 14, text: 'PostShow.layout = (page: any) => <AppLayout>{page}</AppLayout>;' },
    ],
  },
  {
    id: 'orm',
    label: 'app/models/Order.ts',
    lines: [
      { n: 1, text: "import { Model, DB } from 'birframework';" },
      { n: 2, text: '' },
      { n: 3, text: 'export class Order extends Model {' },
      { n: 4, text: "  static table = 'orders';" },
      { n: 5, text: "  static fillable = ['user_id', 'total', 'status'];" },
      { n: 6, text: '}' },
      { n: 7, text: '' },
      { n: 8, text: 'await DB.transaction(async () => {' },
      { n: 9, text: "  const order = await Order.where('id', 42).forUpdate().firstOrFail();" },
      { n: 10, text: "  order.status = 'paid';" },
      { n: 11, text: '  await order.save();' },
      { n: 12, text: '});' },
    ],
  },
];

const BACKEND_MODULES = [
  {
    name: 'Routing & Middleware',
    api: 'Route.get(), Route.group(), ctx.json(), ctx.inertia()',
    href: '/docs/routing',
  },
  {
    name: 'ActiveRecord ORM',
    api: 'SQLite, PostgreSQL, MySQL, .forUpdate(), migrations',
    href: '/docs/database',
  },
  {
    name: 'Sessions & Auth',
    api: 'Memory, FileSessionStore, DatabaseSessionStore, Bearer tokens',
    href: '/docs/auth',
  },
  {
    name: 'Queues & Scheduler',
    api: 'QueueWorker, Schedule.cron(), withoutOverlapping() locks',
    href: '/docs/scheduler',
  },
];

const FRONTEND_MODULES = [
  {
    name: 'Preact + Inertia + SSR',
    api: 'Persistent Page.layout, <Head> SEO meta, scroll preservation',
    href: '/docs/inertia',
  },
  {
    name: 'Forms & Validation',
    api: 'useForm() with FormData uploads, 422 field error hydration',
    href: '/docs/validation',
  },
  {
    name: 'Compression & Streaming',
    api: 'Brotli/Gzip compress(), ETag, 206 Range via ctx.fileStream()',
    href: '/docs/middleware',
  },
  {
    name: 'Serverless & Docker',
    api: 'app.serverless(), bir make:vercel, zero-config Vite manifest',
    href: '/docs/installation',
  },
];

const BENCHMARKS = [
  { metric: 'Home SSR (/)', birjs: '5,352 req/s', nextjs: '1,790 req/s', note: '4.28 ms avg latency, 25 concurrent connections' },
  { metric: 'JSON API (/api/prices)', birjs: '582 req/s', nextjs: '—', note: '653 KB Brotli-compressed response' },
  { metric: 'Vite Production Build', birjs: '~47–460 ms', nextjs: '—', note: 'Preact + Tailwind v4 client chunks' },
];

export default function Welcome({ version, nodeVersion }: { version: string; nodeVersion: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('route');

  const copyInstall = () => {
    navigator.clipboard?.writeText('npx birframework new my-app');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentTab = CODE_TABS.find((t) => t.id === activeTab) || CODE_TABS[0];

  return (
    <div>
      <Head title={`BirJS v${version} — TypeScript Web Framework`} />

      {/* Editorial Split Hero */}
      <section class="border-b border-zinc-200 dark:border-zinc-800/80">
        <div class="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div class="lg:col-span-6 lg:pt-2">
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
              Laravel ergonomics for TypeScript and Preact.
            </h1>

            <p class="mt-5 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
              An integrated Node.js web framework with HTTP routing, ActiveRecord ORM, persistent sessions, queues, and Preact + Inertia + SSR.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex items-center justify-between bg-white dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 rounded-md text-xs font-mono text-zinc-900 dark:text-zinc-200">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-600 dark:text-emerald-400 select-none">$</span>
                  <span class="select-all">npx birframework new my-app</span>
                </div>
                <button
                  type="button"
                  onClick={copyInstall}
                  class="text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-[11px] pl-3 ml-3 border-l border-zinc-200 dark:border-zinc-800 font-sans font-medium cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <Link
                href="/docs/installation"
                class="px-5 py-2.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold transition text-center"
              >
                Documentation
              </Link>
            </div>

            <dl class="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 grid grid-cols-3 gap-6 text-xs">
              <div>
                <dt class="text-zinc-500">Version</dt>
                <dd class="mt-1 font-mono font-semibold text-zinc-950 dark:text-white">v{version}</dd>
              </div>
              <div>
                <dt class="text-zinc-500">Runtime</dt>
                <dd class="mt-1 font-mono font-semibold text-zinc-950 dark:text-white">Node {nodeVersion}</dd>
              </div>
              <div>
                <dt class="text-zinc-500">SSR Speed</dt>
                <dd class="mt-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">5,352 req/s</dd>
              </div>
            </dl>
          </div>

          {/* Code Window */}
          <div class="lg:col-span-6">
            <div class="border border-zinc-200 dark:border-zinc-800 rounded-md bg-[#0C0C0E] text-zinc-100 overflow-hidden">
              <div class="flex items-center border-b border-zinc-800 bg-[#121215] overflow-x-auto">
                {CODE_TABS.map((tab) => {
                  const active = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      class={`px-4 py-2.5 text-[11px] font-mono border-r border-zinc-800 transition cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#0C0C0E] text-white font-semibold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div class="p-4 font-mono text-[12px] leading-6 overflow-x-auto">
                {currentTab.lines.map((line) => (
                  <div key={line.n} class="flex">
                    <span class="w-8 shrink-0 select-none text-zinc-600 text-right pr-4 tabular-nums">{line.n}</span>
                    <span class="text-zinc-200 whitespace-pre">{line.text || ' '}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Index */}
      <section class="border-b border-zinc-200 dark:border-zinc-800/80">
        <div class="max-w-7xl mx-auto px-6 py-16">
          <h2 class="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Core Architecture
          </h2>
          <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            Single-package TypeScript primitives covering HTTP, data, background jobs, and client hydration.
          </p>

          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                Backend Runtime
              </h3>
              <ul class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                {BACKEND_MODULES.map((m) => (
                  <li key={m.name}>
                    <Link href={m.href} class="py-4 flex items-baseline justify-between gap-4 group">
                      <div>
                        <div class="text-sm font-semibold text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {m.name}
                        </div>
                        <div class="mt-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {m.api}
                        </div>
                      </div>
                      <span class="text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white shrink-0">
                        Docs
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                Frontend &amp; Delivery
              </h3>
              <ul class="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                {FRONTEND_MODULES.map((m) => (
                  <li key={m.name}>
                    <Link href={m.href} class="py-4 flex items-baseline justify-between gap-4 group">
                      <div>
                        <div class="text-sm font-semibold text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {m.name}
                        </div>
                        <div class="mt-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {m.api}
                        </div>
                      </div>
                      <span class="text-xs text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white shrink-0">
                        Docs
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Measured Benchmarks Table */}
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Measured Benchmarks
              </h2>
              <p class="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                Recorded on a 1,800+ TLD comparison workload under 25 concurrent connections.
              </p>
            </div>
            <Link
              href="/docs/benchmarks"
              class="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white underline underline-offset-4"
            >
              Benchmark methodology
            </Link>
          </div>

          <div class="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-md overflow-x-auto bg-white dark:bg-[#0C0C0E]">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121215] text-zinc-500 dark:text-zinc-400">
                  <th class="py-3 px-4 font-semibold">Workload</th>
                  <th class="py-3 px-4 font-semibold">BirJS</th>
                  <th class="py-3 px-4 font-semibold">Next.js</th>
                  <th class="py-3 px-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                {BENCHMARKS.map((row) => (
                  <tr key={row.metric}>
                    <td class="py-3.5 px-4 font-medium text-zinc-950 dark:text-white">{row.metric}</td>
                    <td class="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{row.birjs}</td>
                    <td class="py-3.5 px-4 font-mono text-zinc-500 tabular-nums">{row.nextjs}</td>
                    <td class="py-3.5 px-4 text-zinc-600 dark:text-zinc-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

Welcome.layout = (page: any) => <AppLayout version={page.props?.version}>{page}</AppLayout>;
