import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const DOCS_PAGES = [
  { slug: 'overview', title: 'Overview & Philosophy', category: 'Getting Started' },
  { slug: 'benchmarks', title: 'Performance & Benchmarks', category: 'Getting Started' },
  { slug: 'installation', title: 'Installation Guide', category: 'Getting Started' },
  { slug: 'directory-structure', title: 'Directory Structure', category: 'Getting Started' },
  { slug: 'configuration', title: 'Configuration & Env', category: 'Getting Started' },
  { slug: 'routing', title: 'Routing & Parameters', category: 'Core Architecture' },
  { slug: 'controllers', title: 'Controllers & Actions', category: 'Core Architecture' },
  { slug: 'middleware', title: 'HTTP Middleware', category: 'Core Architecture' },
  { slug: 'validation', title: 'Request Validation', category: 'Core Architecture' },
  { slug: 'resources', title: 'API Resources & JSON', category: 'Core Architecture' },
  { slug: 'localization', title: 'Localization & i18n', category: 'Core Architecture' },
  { slug: 'views', title: 'Blade Component Engine', category: 'Frontend & Views' },
  { slug: 'turbo', title: 'Instant Turbo Navigation', category: 'Frontend & Views' },
  { slug: 'database', title: 'Multi-Driver Connections', category: 'Database & ORM' },
  { slug: 'models', title: 'Active Record ORM', category: 'Database & ORM' },
  { slug: 'migrations', title: 'Schema & Migrations', category: 'Database & ORM' },
  { slug: 'factories', title: 'Factories & Seeding', category: 'Database & ORM' },
  { slug: 'auth', title: 'Authentication & Sessions', category: 'Security & Auth' },
  { slug: 'events', title: 'Events & Listeners', category: 'Architecture & Jobs' },
  { slug: 'queues', title: 'Background Queues', category: 'Architecture & Jobs' },
  { slug: 'scheduler', title: 'Task Scheduler', category: 'Architecture & Jobs' },
  { slug: 'storage', title: 'File Storage', category: 'Architecture & Jobs' },
  { slug: 'cache', title: 'Cache System', category: 'Architecture & Jobs' },
  { slug: 'testing', title: 'HTTP Testing & Runner', category: 'Tooling' },
  { slug: 'cli', title: 'CLI Command Reference', category: 'Tooling' },
];

export class DocsController {
  async show(ctx) {
    const rawSlug = ctx.params.slug || 'installation';
    let index = DOCS_PAGES.findIndex((p) => p.slug === rawSlug);

    if (index === -1) {
      index = 1; // fallback to installation
    }

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

    return ctx.render('docs/show', {
      title: current.title,
      slug: current.slug,
      content,
      prevSlug: prev ? prev.slug : '',
      prevTitle: prev ? prev.title : '',
      nextSlug: next ? next.slug : '',
      nextTitle: next ? next.title : '',
    });
  }
}
