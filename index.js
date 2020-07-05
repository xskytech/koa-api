const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const respond = require('koa-respond');
const log4js = require('log4js');

const errorHandler = require('./api/middlewares/error-handler');
const whitelist = require('./api/middlewares/whitelist');
const routes = require('./api/routes');
const config = require('./config');

const app = new Koa();
const logger = log4js.getLogger('./index.js');
const { port, loggerLevel } = config;

log4js.configure({
  appenders: { consoleLog: { type: 'console' } },
  categories: { default: { appenders: ['consoleLog'], level: loggerLevel } },
});

app.use(cors({ origin: whitelist }));
app.use(bodyParser());
app.use(respond({
  statusMethods: { accepted: 202, conflict: 409, unprocessableEntity: 422 },
}));
app.use(errorHandler());
app.use(routes.routes());

app.listen(port, logger.info(`Server is running on port ${port}`));
