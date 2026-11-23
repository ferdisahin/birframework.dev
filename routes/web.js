import { Route, VERSION } from 'birframework';
import { HomeController } from '../app/controllers/HomeController.js';
import { DocsController, DOCS_PAGES } from '../app/controllers/DocsController.js';

const homeController = new HomeController();
const docsController = new DocsController();

// Home Page
Route.get('/', (ctx) => homeController.index(ctx)).name('home');

// Robots.txt for Search Engines
Route.get('/robots.txt', (ctx) => {
  ctx.res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  ctx.res.end("User-agent: *\nAllow: /\n\nSitemap: https://birframework.dev/sitemap.xml\n");
}).name('robots');

// Dynamic Sitemap XML for SEO
Route.get('/sitemap.xml', (ctx) => {
  const baseUrl = 'https://birframework.dev';
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    ...DOCS_PAGES.map((p) => ({
      loc: `${baseUrl}/docs/${p.slug}`,
      priority: '0.8',
      changefreq: 'weekly'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  ctx.res.writeHead(200, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600'
  });
  ctx.res.end(xml);
}).name('sitemap');

// Docs Redirect to Default Page
Route.get('/docs', (ctx) => {
  ctx.res.writeHead(302, { Location: '/docs/installation' });
  ctx.res.end();
}).name('docs.index');

// Documentation Pages
Route.get('/docs/:slug', (ctx) => docsController.show(ctx)).name('docs.show');

// Health API
Route.get('/api/health', (ctx) => {
  return ctx.json({ status: 'ok', uptime: process.uptime(), version: VERSION });
}).name('api.health');
