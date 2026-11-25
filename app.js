import { Application, logger, compress, serveStatic, Inertia } from 'birframework';
import './routes/web.js';

const app = new Application();
app.use(compress({ threshold: 512 }));
app.use(serveStatic({ publicDir: 'public' }));
app.use(Inertia.middleware());
if (process.env.NODE_ENV !== 'production') {
  app.use(logger());
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', (port) => {
  console.log(`BirFramework ready at http://localhost:${port || PORT}`);
});
