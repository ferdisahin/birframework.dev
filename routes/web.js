import { Route } from 'birframework';
import { HomeController } from '../app/controllers/HomeController.js';
import { DocsController } from '../app/controllers/DocsController.js';

const homeController = new HomeController();
const docsController = new DocsController();

// Home Page
Route.get('/', (ctx) => homeController.index(ctx)).name('home');

// Docs Redirect to Default Page
Route.get('/docs', (ctx) => {
  ctx.res.writeHead(302, { Location: '/docs/installation' });
  ctx.res.end();
}).name('docs.index');

// Documentation Pages
Route.get('/docs/:slug', (ctx) => docsController.show(ctx)).name('docs.show');

// Health API
Route.get('/api/health', (ctx) => {
  return ctx.json({ status: 'ok', uptime: process.uptime(), version: '0.1.2' });
}).name('api.health');
