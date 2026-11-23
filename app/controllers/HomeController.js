export class HomeController {
  async index(ctx) {
    return ctx.render('welcome', {
      title: 'BirFramework',
      version: '0.1.2',
      nodeVersion: process.version,
    });
  }
}
