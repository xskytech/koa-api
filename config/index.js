require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,

  loggerLevel: process.env.LOGGER_LEVEL || 'debug',

  whitelist: process.env.WHITELIST || '',

  database: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'koa-api',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres'
  },

  jwtSecret: process.env.JWT_SECRET || 'E+N*H~y%K3BJH8B"'
};
