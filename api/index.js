import { Application, compress, serveStatic, Inertia, logger } from 'birframework';
import '../routes/web.js';

const app = new Application();
app.use(compress({ threshold: 512 }));
app.use(serveStatic({ publicDir: 'public' }));
app.use(Inertia.middleware());

if (process.env.NODE_ENV !== 'production') {
  app.use(logger());
}

export default app.serverless();
