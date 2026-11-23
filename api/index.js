import { Application, logger, defaultViewEngine } from 'birframework';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import '../routes/web.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure ViewEngine finds views directory in Vercel Serverless environment
function resolveViewsDir() {
  const possibleViewsDirs = [
    join(process.cwd(), 'views'),
    resolve(__dirname, '../views'),
    resolve(__dirname, 'views'),
    '/var/task/views',
  ];

  for (const dir of possibleViewsDirs) {
    if (existsSync(dir)) {
      if (typeof defaultViewEngine.setViewsDir === 'function') {
        defaultViewEngine.setViewsDir(dir);
      } else {
        defaultViewEngine.viewsDir = dir;
      }
      break;
    }
  }
}
resolveViewsDir();

const app = new Application();
app.use(logger());

export default async function handler(req, res) {
  try {
    resolveViewsDir();

    // Vercel rewrites: restore the original visitor URL if rewritten
    const matchedPath = req.headers['x-matched-path'] || req.headers['x-forwarded-url'];
    if (matchedPath && typeof matchedPath === 'string') {
      req.url = matchedPath;
    } else if (!req.url || req.url === '/api/index.js' || req.url.startsWith('/api/index')) {
      req.url = '/';
    }

    await app.handle(req, res);
  } catch (err) {
    console.error('Vercel Function Error:', err);
    if (!res.writableEnded) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`
        <div style="font-family:system-ui,-apple-system,sans-serif; padding:2rem; max-width:800px; margin:auto;">
          <h1 style="color:#e11d48; font-size:1.5rem; font-weight:700;">BirFramework Function Error</h1>
          <p style="color:#52525b; font-size:0.875rem;">${err.message}</p>
          <pre style="background:#18181b; color:#f4f4f5; padding:1rem; border-radius:8px; font-size:0.75rem; overflow:auto;">${err.stack}</pre>
        </div>
      `);
    }
  }
}
