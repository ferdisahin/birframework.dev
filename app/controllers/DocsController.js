import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { marked } from 'marked';
import { VERSION } from 'birframework';

export const DOCS_PAGES = [
  { slug: 'overview', title: 'Overview & Philosophy', category: 'Getting Started' },
  { slug: 'benchmarks', title: 'Performance & Benchmarks', category: 'Getting Started' },
  { slug: 'installation', title: 'Installation Guide', category: 'Getting Started' },
  { slug: 'dev-server', title: 'Development Dashboard & HMR', category: 'Getting Started' },
  { slug: 'directory-structure', title: 'Directory Structure', category: 'Getting Started' },
  { slug: 'configuration', title: 'Configuration & Env', category: 'Getting Started' },
  { slug: 'routing', title: 'Routing & Parameters', category: 'Core Architecture' },
  { slug: 'controllers', title: 'Controllers & Actions', category: 'Core Architecture' },
  { slug: 'middleware', title: 'HTTP Middleware', category: 'Core Architecture' },
  { slug: 'providers', title: 'Service Providers & Plugins', category: 'Core Architecture' },
  { slug: 'validation', title: 'Request Validation', category: 'Core Architecture' },
  { slug: 'resources', title: 'API Resources & JSON', category: 'Core Architecture' },
  { slug: 'localization', title: 'Localization & i18n', category: 'Core Architecture' },
  { slug: 'views', title: 'Blade Component Engine', category: 'Frontend & Views' },
  { slug: 'components', title: 'Co-Located Components & JS', category: 'Frontend & Views' },
  { slug: 'jsx', title: 'Type-Safe JSX & TSX', category: 'Frontend & Views' },
  { slug: 'inertia', title: 'Unified Preact & Inertia', category: 'Frontend & Views' },
  { slug: 'database', title: 'Multi-Driver Connections', category: 'Database & ORM' },
  { slug: 'models', title: 'Active Record ORM', category: 'Database & ORM' },
  { slug: 'migrations', title: 'Schema & Migrations', category: 'Database & ORM' },
  { slug: 'factories', title: 'Factories & Seeding', category: 'Database & ORM' },
  { slug: 'auth', title: 'Authentication & Sessions', category: 'Security & Auth' },
  { slug: 'security', title: 'Security & Hardening', category: 'Security & Auth' },
  { slug: 'events', title: 'Events & Listeners', category: 'Architecture & Jobs' },
  { slug: 'queues', title: 'Background Queues', category: 'Architecture & Jobs' },
  { slug: 'scheduler', title: 'Task Scheduler', category: 'Architecture & Jobs' },
  { slug: 'logging', title: 'Structured Logging & Pail', category: 'Architecture & Jobs' },
  { slug: 'storage', title: 'File Storage', category: 'Architecture & Jobs' },
  { slug: 'cache', title: 'Cache System', category: 'Architecture & Jobs' },
  { slug: 'testing', title: 'HTTP Testing & Runner', category: 'Tooling & AI' },
  { slug: 'cli', title: 'CLI Command Reference', category: 'Tooling & AI' },
  { slug: 'ai-rules', title: 'AI Assistant Rules & Cursor', category: 'Tooling & AI' },
];

export class DocsController {
  async show(ctx) {
    const rawSlug = ctx.params.slug || 'installation';
    let index = DOCS_PAGES.findIndex((p) => p.slug === rawSlug);
    if (index === -1) index = 2;

    const current = DOCS_PAGES[index];
    const prev = index > 0 ? DOCS_PAGES[index - 1] : null;
    const next = index < DOCS_PAGES.length - 1 ? DOCS_PAGES[index + 1] : null;

    const possiblePaths = [
      join(process.cwd(), 'docs', `${current.slug}.md`),
      join(process.cwd(), '..', 'docs', `${current.slug}.md`),
      join('/var/task/docs', `${current.slug}.md`),
    ];

    let content = '';
    for (const p of possiblePaths) {
      if (existsSync(p)) {
        content = readFileSync(p, 'utf-8');
        break;
      }
    }

    if (!content) {
      content = `# ${current.title}\n\nDocumentation for this section is coming soon.`;
    }

    const htmlContent = await marked.parse(content);
    const title = `${current.title} — BirJS Docs`;
    const description = `BirJS v${VERSION} documentation: ${current.title} (${current.category}).`;
    const canonical = `https://birjs.com/docs/${current.slug}`;

    return ctx.inertia(
      'DocsShow',
      {
        version: VERSION,
        title: current.title,
        slug: current.slug,
        category: current.category,
        htmlContent,
        pages: DOCS_PAGES,
        prevSlug: prev ? prev.slug : '',
        prevTitle: prev ? prev.title : '',
        nextSlug: next ? next.slug : '',
        nextTitle: next ? next.title : '',
      },
      {
        lang: 'en',
        title,
        description,
        canonical,
        meta: {
          robots: 'index, follow',
          og: { title, description, url: canonical, type: 'article', siteName: 'BirJS' },
          twitter: { card: 'summary', title, description },
        },
      }
    );
  }
}
