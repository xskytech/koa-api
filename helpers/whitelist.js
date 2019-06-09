module.exports = (ctx) => {
  const { origin } = ctx.headers;
  const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : null;
  return whitelist && whitelist.includes(origin) ? origin : false;
};
