const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');

const { User } = require('../../resources/models');
const ErrorMessages = require('../../constants/errors');
const config = require('../../config');

module.exports = (ctx, next) => {
  const { authorization } = ctx.headers;
  const accessToken = authorization && authorization.split(' ')[1];

  return jwt.verify(accessToken, config.jwtSecret, async (error, { id = null } = {}) => {
    const user = await User.findOne({ where: { id } });

    if (error || isEmpty(user)) {
      ctx.state.user = null;
      return ctx.unauthorized({ success: false, message: ErrorMessages.UNAUTHORIZED });
    }

    ctx.state.user = user;
    return next();
  });
};
