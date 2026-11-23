export class HomeController {
  async index(ctx) {
    return ctx.render('welcome', {
      title: 'BirFramework',
      nodeVersion: process.version,
    });
  }
}
