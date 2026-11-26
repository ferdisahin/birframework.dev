import { VERSION } from 'birframework';

export class HomeController {
  async index(ctx) {
    const title = 'BirJS — Full-Stack TypeScript Framework';
    const description =
      'Build full-stack TypeScript apps on Node.js with routing, database models, and server-rendered pages.';
    return ctx.inertia(
      'Welcome',
      {
        version: VERSION,
        nodeVersion: process.version,
      },
      {
        lang: 'en',
        title,
        description,
        canonical: 'https://birjs.com/',
        meta: {
          robots: 'index, follow',
          og: { title, description, url: 'https://birjs.com/', type: 'website', siteName: 'BirJS' },
          twitter: { card: 'summary_large_image', title, description },
        },
      }
    );
  }
}
