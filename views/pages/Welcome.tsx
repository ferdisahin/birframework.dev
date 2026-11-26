import { useState } from 'preact/hooks';
import { Head, Link } from '../../resources/js/bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

const EXPLORER_TABS = [
  {
    id: 'routing',
    label: 'Routing',
    file: 'routes/web.ts',
    code: `import { Route, Context } from 'birframework';
import { PostController } from '../app/controllers/PostController.js';

const posts = new PostController();

Route.get('/', (ctx: Context) => ctx.inertia('Welcome', { version: '0.5.29' }));

Route.group({ prefix: '/api', middleware: ['auth:api'] }, () => {
  Route.get('/posts', (ctx) => posts.index(ctx));
  Route.post('/posts', (ctx) => posts.store(ctx));
  Route.get('/posts/:slug', (ctx) => posts.show(ctx));
});`,
  },
  {
    id: 'inertia',
    label: 'Inertia + TSX',
    file: 'views/pages/PostShow.tsx',
    code: `import { Head, useForm } from '../../resources/js/bir-inertia';
import { AppLayout } from '../layouts/AppLayout';

export default function PostShow({ post }: { post: any }) {
  const { data, setData, post: submit, errors, processing } = useForm({
    body: '',
  });

  return (
    <article class="max-w-3xl mx-auto py-12">
      <Head title={post.title} description={post.excerpt} />
      <h1 class="text-3xl font-bold">{post.title}</h1>
      <form onSubmit={(e) => { e.preventDefault(); submit(\`/posts/\${post.id}/comments\`); }}>
        <textarea value={data.body} onInput={(e) => setData('body', e.currentTarget.value)} />
        {errors.body && <p class="text-red-500 text-xs">{errors.body}</p>}
        <button disabled={processing}>Post Comment</button>
      </form>
    </article>
  );
}

PostShow.layout = (page: any) => <AppLayout>{page}</AppLayout>;`,
  },
  {
    id: 'orm',
    label: 'ORM',
    file: 'app/models/Order.ts',
    code: `import { Model, DB } from 'birframework';

export class Order extends Model {
  static table = 'orders';
  static fillable = ['user_id', 'total', 'status'];
}

await DB.transaction(async () => {
  const order = await Order.where('id', 42).forUpdate().firstOrFail();
  order.status = 'paid';
  await order.save();
});`,
  },
  {
    id: 'auth',
    label: 'Auth',
    file: 'app/controllers/AuthController.ts',
    code: `import { Context, Hash, PersonalAccessToken } from 'birframework';
import { User } from '../models/User.js';

export class AuthController {
  async login(ctx: Context) {
    const { email, password } = await ctx.body();
    const user = await User.where('email', email).firstOrFail();

    if (!(await Hash.verify(password, user.password))) {
      return ctx.json({ error: 'Invalid credentials' }, 401);
    }

    await ctx.auth.login(user);
    return ctx.redirect('/dashboard');
  }
}`,
  },
  {
    id: 'validation',
    label: 'Validation',
    file: 'app/requests/StorePostRequest.ts',
    code: `import { Context } from 'birframework';

export async function storePost(ctx: Context) {
  const data = await ctx.validate({
    title: 'required|string|min:4|max:120',
    slug: 'required|string|unique:posts,slug',
    published: 'boolean',
  });

  return ctx.json({ created: data }, 201);
}`,
  },
  {
    id: 'queues',
    label: 'Queues',
    file: 'app/jobs/SendInvoice.ts',
    code: `import { Job, Mail } from 'birframework';

export class SendInvoice extends Job {
  static queue = 'emails';
  static tries = 3;

  async handle(payload: { email: string; invoiceId: number }) {
    await Mail.to(payload.email).send({
      subject: \`Invoice #\${payload.invoiceId}\`,
      html: '<p>Your invoice is attached.</p>',
    });
  }
}`,
  },
  {
    id: 'scheduler',
    label: 'Scheduler',
    file: 'app/console/kernel.ts',
    code: `import { Schedule } from 'birframework';
import { refreshCatalog } from '../services/catalog.js';

Schedule.call(async () => {
  await refreshCatalog();
})
  .hourly()
  .withoutOverlapping();`,
  },
  {
    id: 'serverless',
    label: 'Serverless',
    file: 'api/index.js',
    code: `import { Application, compress, serveStatic, Inertia } from 'birframework';
import '../routes/web.js';

const app = new Application();
app.use(compress({ threshold: 512 }));
app.use(serveStatic({ publicDir: 'public' }));
app.use(Inertia.middleware());

export default app.serverless();`,
  },
];

const CLI_DEMOS = [
  {
    cmd: 'npx birframework new my-app',
    label: 'Scaffold',
    output: [
      'BirJS Project Wizard v0.5.29',
      '  ✔ Created routes/web.ts, app.ts, vite.config.js',
      '  ✔ Configured Preact + Inertia + Tailwind v4',
      '  ✔ Generated vercel.json and api/index.js',
      'Ready: cd my-app && npm install && npm run dev',
    ],
  },
  {
    cmd: 'bir make:model Invoice -mc',
    label: 'Generators',
    output: [
      '  ✔ Created app/models/Invoice.ts',
      '  ✔ Created database/migrations/20261125_create_invoices_table.ts',
      '  ✔ Created app/controllers/InvoiceController.ts',
    ],
  },
  {
    cmd: 'bir make:vercel',
    label: 'Serverless',
    output: [
      '  ✔ Created vercel.json (buildCommand + public outputDirectory)',
      '  ✔ Created api/index.js (compress + serveStatic + Inertia + app.serverless())',
      'Ready to deploy: run `vercel` or push to GitHub',
    ],
  },
  {
    cmd: 'bir test',
    label: 'Testing',
    output: [
      '  ✔ HTTP & Router Tests (7 passed)',
      '  ✔ ORM Relationships & Locking (5 passed)',
      '  ✔ Serverless Adapter Tests (3 passed)',
      '220 tests passed in 3.3s (0 failed)',
    ],
  },
];

export default function Welcome({ version, nodeVersion }: { version: string; nodeVersion: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('routing');
  const [activeCli, setActiveCli] = useState(0);

  const copyInstall = () => {
    navigator.clipboard?.writeText('npx birframework new my-app');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const currentTab = EXPLORER_TABS.find((t) => t.id === activeTab) || EXPLORER_TABS[0];
  const currentCli = CLI_DEMOS[activeCli] || CLI_DEMOS[0];

  return (
    <div>
      <Head title={`BirJS v${version} — Full-Stack TypeScript Framework`} />

      {/* 1. Architectural Hero */}
      <section class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]">
        <div class="max-w-7xl mx-auto border-x border-zinc-200/80 dark:border-zinc-800/80 px-6 lg:px-10 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-6">
            <h1 class="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-zinc-950 dark:text-white leading-[1.06]">
              The clean full-stack framework for TypeScript.
            </h1>

            <p class="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              BirJS brings Laravel backend structure—routing, ActiveRecord ORM, sessions, queues, and CLI generators—together with Preact, Inertia, and SSR in a single Node.js runtime.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/docs/installation"
                class="px-5 py-2.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold transition"
              >
                Get Started
              </Link>
              <Link
                href="/docs/overview"
                class="px-5 py-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition"
              >
                View framework docs
              </Link>
            </div>

            <div class="mt-6 inline-flex items-center justify-between bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-md text-xs font-mono text-zinc-800 dark:text-zinc-200">
              <span class="text-zinc-400 mr-2 select-none">$</span>
              <span class="select-all">npx birframework new my-app</span>
              <button
                type="button"
                onClick={copyInstall}
                class="ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-800 text-[11px] font-sans font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Layered Stack Architectural SVG */}
          <div class="lg:col-span-6">
            <div class="border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/70 dark:bg-[#0D0D10] p-6 sm:p-8">
              <div class="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-5">
                <span>SYSTEM ARCHITECTURE</span>
                <span>v{version} / Node {nodeVersion}</span>
              </div>

              <div class="space-y-3">
                <div class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141418] rounded-md p-4 flex items-center justify-between">
                  <div>
                    <div class="text-xs font-semibold text-zinc-950 dark:text-white">Client &amp; SSR Layer</div>
                    <div class="text-[11px] font-mono text-zinc-500 mt-0.5">Preact 11 · Inertia Protocol · Vite 8 · Tailwind v4</div>
                  </div>
                  <span class="text-[11px] font-mono text-blue-600 dark:text-blue-400">TSX</span>
                </div>

                <div class="flex justify-center">
                  <div class="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                </div>

                <div class="border border-zinc-900 dark:border-zinc-200 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-md p-4 flex items-center justify-between">
                  <div>
                    <div class="text-xs font-bold">BirJS HTTP Core</div>
                    <div class="text-[11px] font-mono opacity-75 mt-0.5">Router · Middleware · Brotli · Sessions · Auth</div>
                  </div>
                  <span class="text-[11px] font-mono font-semibold tabular-nums">Server-rendered</span>
                </div>

                <div class="flex justify-center">
                  <div class="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141418] rounded-md p-3.5">
                    <div class="text-xs font-semibold text-zinc-950 dark:text-white">ActiveRecord ORM</div>
                    <div class="text-[11px] font-mono text-zinc-500 mt-0.5">SQLite · Postgres · MySQL</div>
                  </div>
                  <div class="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141418] rounded-md p-3.5">
                    <div class="text-xs font-semibold text-zinc-950 dark:text-white">Workers &amp; Deploy</div>
                    <div class="text-[11px] font-mono text-zinc-500 mt-0.5">Queues · Cron · Vercel</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Specification Strip */}
      <section class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0B0B0E]">
        <div class="max-w-7xl mx-auto border-x border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/80 dark:divide-zinc-800/80 text-xs">
          <div class="p-6">
            <div class="text-zinc-500">HTTP Throughput</div>
            <div class="mt-1.5 text-lg font-bold font-mono text-zinc-950 dark:text-white tabular-nums">Server-rendered</div>
            <div class="mt-0.5 text-[11px] text-zinc-500">HTML on the initial request</div>
          </div>
          <div class="p-6">
            <div class="text-zinc-500">Frontend Stack</div>
            <div class="mt-1.5 text-lg font-bold text-zinc-950 dark:text-white">Preact + Inertia</div>
            <div class="mt-0.5 text-[11px] text-zinc-500">Persistent layouts &amp; &lt;Head&gt; SEO</div>
          </div>
          <div class="p-6">
            <div class="text-zinc-500">Database Drivers</div>
            <div class="mt-1.5 text-lg font-bold text-zinc-950 dark:text-white">3 SQL Engines</div>
            <div class="mt-0.5 text-[11px] text-zinc-500">SQLite, PostgreSQL &amp; MySQL</div>
          </div>
          <div class="p-6">
            <div class="text-zinc-500">Deployment Target</div>
            <div class="mt-1.5 text-lg font-bold text-zinc-950 dark:text-white">Vercel &amp; Node</div>
            <div class="mt-0.5 text-[11px] text-zinc-500">Built-in app.serverless() adapter</div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Framework Explorer (Laravel-style 8-tab Split) */}
      <section class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]">
        <div class="max-w-7xl mx-auto border-x border-zinc-200/80 dark:border-zinc-800/80 px-6 lg:px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div class="lg:col-span-5">
            <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
              A framework with strong opinions on every layer
            </h2>
            <p class="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Routing, validation, ORM queries, authentication, background queues, and Inertia rendering share one cohesive TypeScript API—no glue code between separate libraries.
            </p>

            <ul class="mt-6 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
              <li class="flex items-center gap-2.5">
                <span class="text-blue-600 dark:text-blue-400 font-bold">/</span>
                <span>TypeScript-first Vite + Preact + Inertia + SSR</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-blue-600 dark:text-blue-400 font-bold">/</span>
                <span>ActiveRecord ORM with migrations &amp; row locking</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-blue-600 dark:text-blue-400 font-bold">/</span>
                <span>File &amp; Database session stores + Bearer tokens</span>
              </li>
              <li class="flex items-center gap-2.5">
                <span class="text-blue-600 dark:text-blue-400 font-bold">/</span>
                <span>Brotli compression, ETag, and Range streaming</span>
              </li>
            </ul>

            <div class="mt-8">
              <Link
                href="/docs/routing"
                class="inline-flex items-center px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
              >
                Explore the framework
              </Link>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="flex flex-wrap gap-1.5 mb-3">
              {EXPLORER_TABS.map((tab) => {
                const active = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    class={`px-3 py-1.5 rounded-md text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div class="border border-zinc-200 dark:border-zinc-800 rounded-md bg-[#0C0C0E] text-zinc-100 overflow-hidden">
              <div class="px-4 py-2.5 border-b border-zinc-800 bg-[#121215] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{currentTab.file}</span>
                <span>TypeScript</span>
              </div>
              <pre class="p-5 font-mono text-[12px] leading-6 overflow-x-auto text-zinc-200">
                <code>{currentTab.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Capabilities Grid (Next.js-style Diagram Cards + Sub-Grid) */}
      <section class="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-[#0B0B0E]">
        <div class="max-w-7xl mx-auto border-x border-zinc-200/80 dark:border-zinc-800/80 px-6 lg:px-10 py-20">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Everything required to ship production web apps
            </h2>
            <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Built-in subsystems that integrate cleanly across server, client, and CLI.
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Card 1 */}
            <Link href="/docs/inertia" class="group border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-[#111113] p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition">
              <div class="h-36 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0B0B0E] p-4 flex flex-col justify-between font-mono text-[11px]">
                <div class="flex items-center justify-between text-zinc-500">
                  <span>ctx.inertia(&apos;DocsShow&apos;)</span>
                  <span class="text-blue-600 dark:text-blue-400">200 OK</span>
                </div>
                <div class="border border-dashed border-zinc-300 dark:border-zinc-700 rounded p-2 text-zinc-700 dark:text-zinc-300">
                  &lt;DocsLayout&gt; persistent<br />
                  &nbsp;&nbsp;&lt;DocsShow /&gt; swapped
                </div>
                <div class="text-zinc-500">X-Bir-Inertia: true · Vary header</div>
              </div>
              <h3 class="mt-5 text-sm font-bold text-zinc-950 dark:text-white group-hover:underline underline-offset-4">
                Unified Preact + Inertia + SSR
              </h3>
              <p class="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                SPA-speed navigation with persistent layouts, server-rendered SEO &lt;Head&gt; tags, and automatic client fallback.
              </p>
            </Link>

            {/* Visual Card 2 */}
            <Link href="/docs/database" class="group border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-[#111113] p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition">
              <div class="h-36 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0B0B0E] p-4 flex flex-col justify-between font-mono text-[11px]">
                <div class="text-zinc-500">DB.transaction()</div>
                <div class="space-y-1.5">
                  <div class="px-2 py-1 rounded bg-white dark:bg-[#16161A] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
                    Order.where(&apos;id&apos;, 42).forUpdate()
                  </div>
                  <div class="flex gap-2 text-[10px] text-zinc-500">
                    <span class="px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded">SQLite</span>
                    <span class="px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded">Postgres</span>
                    <span class="px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded">MySQL</span>
                  </div>
                </div>
                <div class="text-zinc-500">Pessimistic row locking</div>
              </div>
              <h3 class="mt-5 text-sm font-bold text-zinc-950 dark:text-white group-hover:underline underline-offset-4">
                Multi-Driver ActiveRecord ORM
              </h3>
              <p class="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Fluent query builder, relationships, schema migrations, seeders, factories, and transaction row locks.
              </p>
            </Link>

            {/* Visual Card 3 */}
            <Link href="/docs/middleware" class="group border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-[#111113] p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition">
              <div class="h-36 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0B0B0E] p-4 flex flex-col justify-between font-mono text-[11px]">
                <div class="flex justify-between text-zinc-500">
                  <span>compress()</span>
                  <span>br / gzip</span>
                </div>
                <div class="space-y-1.5">
                  <div class="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded overflow-hidden">
                    <div class="h-full w-1/4 bg-blue-600 dark:bg-blue-400" />
                  </div>
                  <div class="text-[10px] text-zinc-500">653 KB JSON -&gt; 48 KB Brotli</div>
                </div>
                <div class="text-zinc-500">ETag · 206 Partial Content</div>
              </div>
              <h3 class="mt-5 text-sm font-bold text-zinc-950 dark:text-white group-hover:underline underline-offset-4">
                Compression, ETag &amp; Streaming
              </h3>
              <p class="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Built-in Brotli/Gzip compression, conditional caching headers, and byte-range media streaming via ctx.fileStream().
              </p>
            </Link>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Persistent Auth & Sessions', desc: 'Memory, FileSessionStore, DatabaseSessionStore, and Bearer API tokens.', href: '/docs/auth' },
              { title: 'Task Scheduler', desc: 'Fluent cron expressions with atomic withoutOverlapping() lock guards.', href: '/docs/scheduler' },
              { title: 'Background Queues', desc: 'Retryable async jobs with failed-job inspection and worker CLI.', href: '/docs/queues' },
              { title: 'WebSocket Channels', desc: 'Native WebSocket server with fragmentation handling and auth.', href: '/docs/events' },
              { title: 'Cache Drivers', desc: 'Unified Memory, File, and Redis cache API across workers.', href: '/docs/cache' },
              { title: 'HTTP Test Client', desc: 'createTestClient() for fast integration assertions without ports.', href: '/docs/testing' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                class="border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-[#111113] p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition"
              >
                <h3 class="text-sm font-semibold text-zinc-950 dark:text-white">{item.title}</h3>
                <p class="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLI & Serverless Deployment + Benchmarks */}
      <section class="bg-white dark:bg-[#09090B]">
        <div class="max-w-7xl mx-auto border-x border-zinc-200/80 dark:border-zinc-800/80 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/80 dark:divide-zinc-800/80">
          {/* Interactive CLI */}
          <div class="p-6 lg:p-10">
            <h2 class="text-xl font-bold text-zinc-950 dark:text-white">
              Artisan-grade CLI &amp; Vercel Serverless
            </h2>
            <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Generate models, controllers, migrations, or zero-config Vercel deployments from one command line.
            </p>

            <div class="mt-5 flex flex-wrap gap-1.5">
              {CLI_DEMOS.map((item, idx) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveCli(idx)}
                  class={`px-2.5 py-1 rounded text-[11px] font-medium border transition cursor-pointer ${
                    idx === activeCli
                      ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div class="mt-4 border border-zinc-200 dark:border-zinc-800 rounded-md bg-[#0C0C0E] p-4 font-mono text-[12px] leading-6 text-zinc-300">
              <div class="text-white">$ {currentCli.cmd}</div>
              {currentCli.output.map((line) => (
                <div key={line} class="text-zinc-400">{line}</div>
              ))}
            </div>
          </div>

          {/* Benchmarks */}
          <div class="p-6 lg:p-10">
            <div class="flex items-baseline justify-between gap-4">
              <h2 class="text-xl font-bold text-zinc-950 dark:text-white">
                Measure your application
              </h2>
              <Link href="/docs/benchmarks" class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Methodology
              </Link>
            </div>
            <p class="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Build for production and measure your actual routes, data, and deployment environment.
            </p>

            <div class="mt-6 space-y-5 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              <p>Measure rendered pages and JSON endpoints separately. Include database queries and authentication when they are part of your workload.</p>
              <p>Record runtime versions, response size, throughput, latency percentiles, and errors with each result.</p>
              <code class="block overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800 p-4 text-xs">npx autocannon -c 10 -d 30 http://localhost:3000/</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Welcome.layout = (page: any) => <AppLayout version={page.props?.version}>{page}</AppLayout>;
