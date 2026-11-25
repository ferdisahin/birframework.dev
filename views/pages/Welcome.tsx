import { useState } from 'preact/hooks';
import { Head, Link } from '../../resources/js/bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

const CODE_TABS = [
  {
    id: 'controller',
    label: 'Controller + Route',
    file: 'app/controllers/PostController.ts',
    code: `import { Route, Context } from 'birframework';
import { Post } from '../models/Post.js';

Route.get('/posts/:slug', async (ctx: Context) => {
  const post = await Post.where('slug', ctx.params.slug).firstOrFail();

  return ctx.inertia('PostShow', {
    post,
    canEdit: ctx.auth.check(),
  }, {
    title: post.title,
    canonical: \`https://birjs.com/posts/\${post.slug}\`,
  });
});`,
  },
  {
    id: 'page',
    label: 'Page.tsx (Inertia)',
    file: 'views/pages/PostShow.tsx',
    code: `import { Head, useForm } from '../bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

export default function PostShow({ post }: { post: any }) {
  const { data, setData, post: submit, processing } = useForm({
    body: '',
  });

  return (
    <article class="max-w-3xl mx-auto py-12">
      <Head title={post.title} />
      <h1 class="text-3xl font-bold">{post.title}</h1>
      <form onSubmit={(e) => { e.preventDefault(); submit('/comments'); }}>
        <textarea value={data.body} onInput={(e) => setData('body', e.currentTarget.value)} />
        <button disabled={processing}>Publish</button>
      </form>
    </article>
  );
}

PostShow.layout = (page: any) => <AppLayout>{page}</AppLayout>;`,
  },
  {
    id: 'orm',
    label: 'ActiveRecord ORM',
    file: 'app/models/Order.ts',
    code: `import { Model, DB } from 'birframework';

export class Order extends Model {
  static table = 'orders';
  static fillable = ['user_id', 'total', 'status'];
}

// Atomic transaction with pessimistic row lock
await DB.transaction(async () => {
  const order = await Order.where('id', 42).forUpdate().firstOrFail();
  order.status = 'paid';
  await order.save();
});`,
  },
];

const CAPABILITIES = [
  {
    title: 'Unified Preact + Inertia + SSR',
    desc: 'Persistent layouts (Page.layout), useForm() with FormData uploads, server-side <Head> SEO tags, and zero-flicker navigation.',
    href: '/docs/inertia',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Multi-Driver ORM & Row Locks',
    desc: 'SQLite, PostgreSQL, and MySQL with fluent QueryBuilder, relationships, schema migrations, and .forUpdate() locking.',
    href: '/docs/database',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
      </svg>
    ),
  },
  {
    title: 'Persistent Auth & Sessions',
    desc: 'Signed cookie sessions backed by Memory, FileSessionStore, or DatabaseSessionStore with Bearer API token support.',
    href: '/docs/auth',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Brotli, ETag & Range Streaming',
    desc: 'Built-in compress() middleware, 206 Partial Content media streaming via ctx.fileStream(), and automatic security headers.',
    href: '/docs/middleware',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Cross-Process Task Scheduler',
    desc: 'Fluent cron scheduling with atomic lock guards via withoutOverlapping() for multi-worker production safety.',
    href: '/docs/scheduler',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Queues, WebSockets & Cache',
    desc: 'Background job workers, native WebSocket broadcasting, and Memory, File, or Redis cache drivers out of the box.',
    href: '/docs/cache',
    icon: (
      <svg class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 17l6-6-6-6M12 19h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Welcome({ version, nodeVersion }: { version: string; nodeVersion: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('controller');

  const copyInstall = () => {
    navigator.clipboard?.writeText('npx birframework new my-app');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentCode = CODE_TABS.find((t) => t.id === activeTab) || CODE_TABS[0];

  return (
    <div>
      <Head title={`BirJS v${version} — Full-Stack TypeScript Framework`} />

      {/* Split Hero */}
      <section class="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800/80">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-radial from-emerald-500/12 via-transparent to-transparent blur-3xl"
        />

        <div class="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6">
            <Link
              href="/docs/installation"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#0E1116] border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/50 transition mb-6"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500" />
              <span class="font-medium">BirJS v{version}</span>
              <span class="text-zinc-400 dark:text-zinc-600">/</span>
              <span class="text-zinc-500 dark:text-zinc-400">Unified Inertia + TSX</span>
            </Link>

            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
              Full-stack TypeScript with zero ceremony.
            </h1>

            <p class="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Laravel backend ergonomics paired with Unified Preact, Inertia, and SSR. ActiveRecord ORM, sessions, queues, WebSockets, and Vercel-ready builds in one cohesive runtime.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div class="flex items-center justify-between bg-white dark:bg-[#0E1116] border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs text-zinc-900 dark:text-zinc-200 font-mono">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-500 select-none">$</span>
                  <span class="select-all">npx birframework new my-app</span>
                </div>
                <button
                  type="button"
                  onClick={copyInstall}
                  class="text-zinc-500 hover:text-zinc-950 dark:hover:text-white text-[11px] pl-3 ml-3 border-l border-zinc-200 dark:border-zinc-800 font-sans font-medium transition cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <Link
                href="/docs/installation"
                class="px-5 py-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Read the Docs</span>
              </Link>
            </div>
          </div>

          {/* Interactive Code Showcase */}
          <div class="lg:col-span-6">
            <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#0B0D11] text-zinc-100 shadow-2xl overflow-hidden">
              <div class="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/90 bg-[#0E1116]">
                <div class="flex items-center gap-1.5">
                  {CODE_TABS.map((tab) => {
                    const active = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        class={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                          active
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
                <span class="hidden sm:inline text-[11px] font-mono text-zinc-500">{currentCode.file}</span>
              </div>

              <pre class="p-5 text-[12px] leading-relaxed font-mono overflow-x-auto text-zinc-200 bg-[#0B0D11]">
                <code>{currentCode.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Runtime Spec Strip */}
      <section class="border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0B0D11]">
        <div class="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div>
            <div class="text-zinc-500">Server Runtime</div>
            <div class="mt-1 font-semibold text-zinc-950 dark:text-white font-mono">Node.js {nodeVersion}</div>
          </div>
          <div>
            <div class="text-zinc-500">Frontend Layer</div>
            <div class="mt-1 font-semibold text-zinc-950 dark:text-white">Preact + Inertia + SSR</div>
          </div>
          <div>
            <div class="text-zinc-500">SSR Throughput</div>
            <div class="mt-1 font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">5,352 req/s</div>
          </div>
          <div>
            <div class="text-zinc-500">Deployment</div>
            <div class="mt-1 font-semibold text-zinc-950 dark:text-white">Vercel Serverless &amp; Docker</div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="architecture" class="py-20 border-b border-zinc-200 dark:border-zinc-800/80">
        <div class="max-w-7xl mx-auto px-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Batteries included for production systems
            </h2>
            <p class="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              Every primitive you expect in a modern web application, unified under one TypeScript dependency tree.
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                class="group rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#0E1116] p-6 hover:border-emerald-500/50 transition flex flex-col justify-between"
              >
                <div>
                  <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 class="text-sm font-semibold text-zinc-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {item.title}
                  </h3>
                  <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div class="mt-4 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition">
                  Explore docs
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benchmarks Section */}
      <section id="benchmarks" class="py-20 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0B0D11]">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div class="lg:col-span-5">
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Measured production speed
            </h2>
            <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Tested on the identical 1,800+ TLD comparison workload with 25 concurrent connections and Brotli compression enabled.
            </p>
            <div class="mt-6">
              <Link
                href="/docs/benchmarks"
                class="inline-flex items-center px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                View Benchmark Methodology
              </Link>
            </div>
          </div>

          <div class="lg:col-span-7 space-y-5">
            <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#0E1116] p-5">
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="font-semibold text-zinc-950 dark:text-white">BirJS (Preact + Inertia + SSR)</span>
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">5,352 req/s &middot; 4.28 ms avg</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500 w-full" />
              </div>

              <div class="flex items-center justify-between text-xs mt-4 mb-2">
                <span class="font-medium text-zinc-600 dark:text-zinc-400">Next.js (App Router SSR)</span>
                <span class="font-mono text-zinc-500 tabular-nums">1,790 req/s</span>
              </div>
              <div class="h-2.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div class="h-full rounded-full bg-zinc-400 dark:bg-zinc-600 w-[33%]" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#0E1116] p-4">
                <div class="text-zinc-500">Brotli JSON API (/api/prices)</div>
                <div class="mt-1.5 text-2xl font-bold text-zinc-950 dark:text-white font-mono tabular-nums">582 req/s</div>
                <div class="mt-1 text-zinc-500">653 KB compressed payload</div>
              </div>
              <div class="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-[#0E1116] p-4">
                <div class="text-zinc-500">Vite Production Build</div>
                <div class="mt-1.5 text-2xl font-bold text-zinc-950 dark:text-white font-mono tabular-nums">&lt; 500 ms</div>
                <div class="mt-1 text-zinc-500">Tree-shaken Preact + Tailwind chunks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ship in Seconds CTA */}
      <section class="py-20">
        <div class="max-w-4xl mx-auto px-6 text-center">
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Start building in seconds
          </h2>
          <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            Scaffold a TypeScript + Vite + Inertia project and deploy to Vercel or Docker without extra configuration.
          </p>
          <div class="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/docs/installation"
              class="px-5 py-2.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/docs/overview"
              class="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              Read Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

Welcome.layout = (page: any) => <AppLayout version={page.props?.version}>{page}</AppLayout>;
