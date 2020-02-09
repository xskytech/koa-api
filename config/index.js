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
    dialect: 'postgres',
    logging: JSON.parse(process.env.DB_LOGGING) || false
  },

  jwtSecret: process.env.JWT_SECRET || 'E+N*H~y%K3BJH8B"',

  mailer: {
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',

    emails: {
      admin: 'XSKYTECH Admin <admin@example.com>',
      support: 'XSKYTECH Support <support@example.com>'
    }
  },

  social: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUrl: process.env.GOOGLE_REDIRECT_URL || '',
      accessTokenUrl: 'https://oauth2.googleapis.com/token',
      profileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo'
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      redirectUrl: process.env.FACEBOOK_REDIRECT_URL || '',
      accessTokenUrl: 'https://graph.facebook.com/v4.0/oauth/access_token',
      profileUrl: 'https://graph.facebook.com/v4.0/me'
    }
  }
};
