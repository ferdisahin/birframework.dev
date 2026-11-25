import { VERSION } from 'birframework';

export class HomeController {
  async index(ctx) {
    const title = 'BirJS — Full-Stack TypeScript Framework';
    const description =
      'Laravel backend ergonomics paired with Unified Preact + Inertia + SSR and sub-millisecond V8 speed.';
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
