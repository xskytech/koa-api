const { promisify } = require('util');

const { isEmpty } = require('lodash');
const jwt = require('jsonwebtoken');

const { User } = require('../../resources/models');
const ErrorMessages = require('../../constants/errors');
const config = require('../../config');

module.exports = (ctx, next) => {
  const { authorization } = ctx.headers;
  const accessToken = authorization && authorization.split(' ')[1];

  return jwt.verify(accessToken, config.jwtSecret, async (e, r = {}) => {
    let error = e;
    let payload = r;
    let generateJwt = false;

    if (error && error.name === 'TokenExpiredError') {
      error = null;
      payload = await promisify(jwt.verify)(
        accessToken, config.jwtSecret, { ignoreExpiration: true }
      );

      generateJwt = true;
    }

    const { id = null, accessTokenSalt = null, refreshToken = null } = payload;
    const user = await User.findOne({ where: { id, accessTokenSalt, refreshToken } });

    if (error || isEmpty(user)) {
      ctx.state.user = null;
      return ctx.unauthorized({ message: ErrorMessages.UNAUTHORIZED });
    }

    if (generateJwt) {
      await user.updateRefreshToken();
      await user.save();
      ctx.set('auth', user.authenticate());
    }

    ctx.state.user = user;
    return next();
  });
};
