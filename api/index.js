import { Application, logger } from 'birframework';
import '../routes/web.js';

const app = new Application();
app.use(logger());

export default async function handler(req, res) {
  await app.handle(req, res);
}
