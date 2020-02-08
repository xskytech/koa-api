const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { isEmpty, pick } = require('lodash');

const BaseController = require('./BaseController');

const {
  sequelize, User, UserSocial, Token
} = require('../../resources/models');
const Mailer = require('../../services/Mailer');
const Social = require('../../utils/Social');
const ErrorMessages = require('../../constants/errors');
const Statuses = require('../../constants/statuses');
const Tokens = require('../../constants/tokens');

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
    const activationToken = (await promisify(randomBytes)(32)).toString('hex');
    const { password = '' } = ctx.request.body;

    const user = await User.create(
      {
        ...pick(ctx.request.body, ['fullName', 'email']),
        password,
        tokens: [{
          type: Tokens.ACTIVATION,
          value: activationToken
        }]
      },
      {
        include: [{
          model: Token,
          as: 'tokens'
        }]
      }
    );

    const options = {
      to: user.email,
      subject: 'Welcome to XSKYTECH koa-api.',
      template: 'sign-up',
      params: {
        // TODO: generate activation url in front
        confirmationUrl: `http://localhost:4000/v1/users/activate?token=${activationToken}`
      }
    };

    await Mailer.send(options);

    ctx.created({ user });
  }

  static async signIn(ctx) {
    const { email = '', password } = ctx.request.body;

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });

    if (isEmpty(user) || !await user.comparePassword(password)) {
      return ctx.unauthorized({ message: ErrorMessages.INVALID_CREDENTIALS });
    }

    if (user.status !== Statuses.ACTIVE) {
      return ctx.forbidden({ message: Object.keys(Statuses)[user.status - 1] });
    }

    return ctx.ok({ user, auth: user.authenticate() });
  }

  static async socialAuth(ctx) {
    const { type, code } = ctx.request.body;

    const socialData = await Social.getData({ type, code });
    const { email, socials } = socialData;
    const { socialId, type: socialType } = socials;

    let user = await User.findOne({
      where: { email },
      include: [{
        model: UserSocial,
        as: 'socials'
      }]
    });

    if (isEmpty(user)) {
      user = await User.create(socialData, {
        include: [{
          model: UserSocial,
          as: 'socials'
        }]
      });
    } else {
      const userSocial = await UserSocial.findOrCreate({
        where: {
          userId: user.id,
          socialId,
          type: socialType
        },
        defaults: socials
      });

      if (isEmpty(user.socials.find(
        s => s.socialId === userSocial.socialId && s.type === userSocial.type
      ))) {
        user.dataValues.socials = [
          ...user.socials,
          userSocial[0]
        ];
      }
    }

    ctx.ok({ user, auth: user.authenticate() });
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

  static async activate(ctx) {
    const { token: activationToken } = ctx.request.query;

    const token = await Token.findOne({
      where: {
        type: Tokens.ACTIVATION,
        value: activationToken
      }
    });

    if (isEmpty(token)) {
      return ctx.notFound({ message: ErrorMessages.NOT_FOUND });
    }

    const activated = await sequelize.transaction(async (transaction) => {
      await User.update(
        {
          status: Statuses.ACTIVE
        },
        {
          where: {
            id: token.userId
          },
          transaction
        }
      );

      const deleted = await token.destroy({ transaction });

      return deleted;
    });

    if (!activated) {
      return ctx.conflict({ message: ErrorMessages.CONFLICT });
    }

    return ctx.accepted({});
  }
}

module.exports = UsersController;
