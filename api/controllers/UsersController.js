const { pick } = require('lodash');

const BaseController = require('./BaseController');

const { User } = require('../../resources/models');

class UsersController extends BaseController {
  static getAll(/* ctx */) {

  }

  static getById(/* ctx */) {

  }

  static async create(ctx) {
    const user = await User.create(pick(ctx.request.body, ['fullName', 'email', 'password']));

    ctx.ok({ success: true, payload: { user, auth: 'auth' } });
  }

  static signIn(/* ctx */) {

  }

  static update(/* ctx */) {

  }

  static delete(/* ctx */) {

  }
}

module.exports = UsersController;
