const config = require('../../config');

module.exports = (ctx) => {
  const { origin } = ctx.headers;
  const whitelist = config.whitelist ? config.whitelist.split(',') : null;
  return whitelist && whitelist.includes(origin) ? origin : false;
};
