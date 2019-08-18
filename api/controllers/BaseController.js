class BaseController {
  static async ping(ctx) {
    ctx.ok({ ping: 'pong' });
  }
}

module.exports = BaseController;
