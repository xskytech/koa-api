const { isEmpty, pick } = require('lodash');

const BaseController = require('./BaseController');

const { User } = require('../../resources/models');
const ErrorMessages = require('../../constants/errors');

class UsersController extends BaseController {
  static async getAll(ctx) {
    const users = await User.findAll();

    if (isEmpty(users)) {
      return ctx.notFound({ success: false, message: ErrorMessages.NOT_FOUND });
    }

    return ctx.ok({ success: true, payload: { users } });
  }

  static async getById(ctx) {
    const { id } = ctx.params;

    const user = await User.findOne({ where: { id } });

    if (isEmpty(user)) {
      return ctx.notFound({ success: false, message: ErrorMessages.NOT_FOUND });
    }

    return ctx.ok({ success: true, payload: { user } });
  }

  static async create(ctx) {
    const user = await User.create(pick(ctx.request.body, ['fullName', 'email', 'password']));

    ctx.created({ success: true, payload: { user, auth: user.authenticate() } });
  }

  static async signIn(ctx) {
    const { email = '', password } = ctx.request.body;

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (isEmpty(user) || !await user.comparePassword(password)) {
      return ctx.unauthorized({ success: false, message: ErrorMessages.INVALID_CREDENTIALS });
    }

    return ctx.ok({ success: true, payload: { user, auth: user.authenticate() } });
  }

  static async update(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;
    const { password } = ctx.request.body;

    if (parseInt(id, 10) !== userId) {
      return ctx.forbidden({ success: false, message: ErrorMessages.FORBIDDEN });
    }

    const user = await User.findOne({ where: { id } });

    if (isEmpty(user)) {
      return ctx.notFound({ success: false, message: ErrorMessages.NOT_FOUND });
    }

    user.password = password;
    await user.save();

    return ctx.accepted({ success: true, payload: { user } });
  }

  static async delete(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;

    if (parseInt(id, 10) !== userId) {
      return ctx.forbidden({ success: false, message: ErrorMessages.FORBIDDEN });
    }

    const deleted = await User.destroy({ where: { id } });

    return ctx.accepted({ success: Boolean(deleted) });
  }
}

module.exports = UsersController;
