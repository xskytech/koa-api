const { isEmpty, pick } = require('lodash');

const BaseController = require('./BaseController');

const { User } = require('../../resources/models');
const ErrorMessages = require('../../constants/errors');

class UsersController extends BaseController {
  static getAll(/* ctx */) {

  }

  static getById(/* ctx */) {

  }

  static async create(ctx) {
    const user = await User.create(pick(ctx.request.body, ['fullName', 'email', 'password']));

    ctx.created({ success: true, payload: { user, auth: user.authorize() } });
  }

  static async signIn(ctx) {
    const { email = '', password } = ctx.request.body;

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (isEmpty(user) || !await user.comparePassword(password)) {
      return ctx.unauthorized({ success: false, message: ErrorMessages.INVALID_CREDENTIALS });
    }

    return ctx.ok({ success: true, payload: { user, auth: user.authorize() } });
  }

  static update(/* ctx */) {

  }

  static delete(/* ctx */) {

  }
}

module.exports = UsersController;
