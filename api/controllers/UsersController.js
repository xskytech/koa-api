const { isEmpty, pick } = require('lodash');

const BaseController = require('./BaseController');

const { User } = require('../../resources/models');
const ErrorMessages = require('../../constants/errors');

class UsersController extends BaseController {
  static async getAll(ctx) {
    const users = await User.findAll();

    if (isEmpty(users)) {
      return ctx.notFound({ message: ErrorMessages.NOT_FOUND });
    }

    return ctx.ok({ users });
  }

  static async getById(ctx) {
    const { id } = ctx.params;

    const user = await User.findOne({ where: { id } });

    if (isEmpty(user)) {
      return ctx.notFound({ message: ErrorMessages.NOT_FOUND });
    }

    return ctx.ok({ user });
  }

  static async create(ctx) {
    const user = await User.create(pick(ctx.request.body, ['fullName', 'email', 'password']));

    ctx.created({ user, auth: user.authenticate() });
  }

  static async signIn(ctx) {
    const { email = '', password } = ctx.request.body;

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (isEmpty(user) || !await user.comparePassword(password)) {
      return ctx.unauthorized({ message: ErrorMessages.INVALID_CREDENTIALS });
    }

    return ctx.ok({ user, auth: user.authenticate() });
  }

  static async update(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;
    const { password } = ctx.request.body;

    if (parseInt(id, 10) !== userId) {
      return ctx.forbidden({ message: ErrorMessages.FORBIDDEN });
    }

    const user = await User.findOne({ where: { id } });

    if (isEmpty(user)) {
      return ctx.notFound({ message: ErrorMessages.NOT_FOUND });
    }

    user.password = password;
    await user.save();

    return ctx.accepted({ user });
  }

  static async delete(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;

    if (parseInt(id, 10) !== userId) {
      return ctx.forbidden({ message: ErrorMessages.FORBIDDEN });
    }

    const deleted = await User.destroy({ where: { id } });

    if (!deleted) {
      return ctx.conflict({ message: ErrorMessages.CONFLICT });
    }

    return ctx.accepted({});
  }
}

module.exports = UsersController;
