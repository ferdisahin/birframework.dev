export class DocsController {
  async show(ctx) {
    const validSlugs = [
      'overview',
      'installation',
      'directory-structure',
      'configuration',
      'routing',
      'controllers',
      'middleware',
      'validation',
      'views',
      'turbo',
      'database',
      'models',
      'migrations',
      'auth',
      'queues',
      'scheduler',
      'storage',
      'cli',
    ];

    const slug = ctx.params.slug || 'installation';

    if (!validSlugs.includes(slug)) {
      return ctx.render('docs/installation', {
        slug: 'installation',
        version: '0.1.2',
      });
    }

    return ctx.render(`docs/${slug}`, {
      slug,
      version: '0.1.2',
    });
  }
}
