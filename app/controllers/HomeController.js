export class HomeController {
  async index(ctx) {
    return ctx.render('welcome', {
      title: 'BirJS',
      nodeVersion: process.version,
    });
  }
}
