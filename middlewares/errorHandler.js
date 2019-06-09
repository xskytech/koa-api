const logger = require('log4js').getLogger('./middlewares/errorHandler.js');

const ErrorMessages = require('../constants/ErrorMessages');

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
