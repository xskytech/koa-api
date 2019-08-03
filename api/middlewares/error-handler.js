const { isEmpty, find } = require('lodash');
const errorCodes = require('pg-error-codes');
const logger = require('log4js').getLogger('./middlewares/error-handler.js');

const ErrorMessages = require('../../constants/errors');

module.exports = () => async (ctx, next) => {
  try {
    return await next();
  } catch (error) {
    logger.error(error.message || error);

    const sequelizeErrorNames = [
      'SequelizeUniqueConstraintError', // db unique error
      'SequelizeValidationError' // model validation error
    ];

    const errorsWithArguments = ['len'];

    if (sequelizeErrorNames.includes(error.name)) {
      const errors = [];

      if (!isEmpty(error) && !isEmpty(error.errors)) {
        error.errors.forEach((eachError) => {
          if (!find(errors, ['field', eachError.path])) {
            errors.push({
              field: eachError.path,
              message: eachError.message,
              args: errorsWithArguments.includes(eachError.validatorKey)
                ? eachError.validatorArgs : undefined
            });
          }
        });
      } else {
        errors.push({
          field: error.original.column,
          message: errorCodes[error.original.code].toUpperCase()
        });
      }

      return ctx.unprocessableEntity({
        message: ErrorMessages.UNPROCESSABLE_ENTITY,
        errors
      });
    }

    return ctx.internalServerError({
      message: ErrorMessages.INTERNAL_SERVER_ERROR
    });
  }
};
