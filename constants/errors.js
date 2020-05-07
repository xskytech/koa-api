module.exports = {
  UNAUTHORIZED: 'UNAUTHORIZED', // 401
  FORBIDDEN: 'FORBIDDEN', // 403
  NOT_FOUND: 'NOT_FOUND', // 404
  CONFLICT: 'CONFLICT', // 409
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY', // 422
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR', // 500

  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  VALIDATION: {
    REQUIRED: 'REQUIRED',
    LENGTH: 'LENGTH',
    INVALID_EMAIL: 'INVALID_EMAIL',
    UNIQUE: 'UNIQUE',
  },
};
