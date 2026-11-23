import { Application, logger } from 'birframework';
import './routes/web.js';

const app = new Application();
app.use(logger());

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', (port) => {
  console.log(`BirFramework ready at http://localhost:${port || PORT}`);
});
