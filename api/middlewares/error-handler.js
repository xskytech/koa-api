const logger = require('log4js').getLogger('./middlewares/error-handler.js');

const ErrorMessages = require('../../constants/errors');

module.exports = () => async (ctx, next) => {
  try {
    return await next();
  } catch (error) {
    logger.error(error.message || error);

    return ctx.internalServerError({
      success: false,
      message: ErrorMessages.INTERNAL_SERVER_ERROR
    });
  }
};
