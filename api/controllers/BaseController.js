class BaseController {
  static async ping(ctx) {
    ctx.ok({ success: true, payload: 'pong' });
  }
}

module.exports = BaseController;
