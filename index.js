const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const respond = require('koa-respond');
const log4js = require('log4js');
require('dotenv').config();

const whitelist = require('./helpers/whitelist');
const errorHandler = require('./middlewares/errorHandler');
const v1Routes = require('./routes/v1');

const app = new Koa();
const logger = log4js.getLogger('./index.js');
const loggerLevel = process.env.LOGGER_LEVEL || 'debug';
const port = process.env.PORT || 4000;

log4js.configure({
  appenders: { consoleLog: { type: 'console' } },
  categories: { default: { appenders: ['consoleLog'], level: loggerLevel } }
});

app.use(cors({ origin: whitelist }));
app.use(bodyParser());
app.use(respond());
app.use(errorHandler());
app.use(v1Routes.routes());

app.listen(port, logger.info(`Server is running on port ${port}`));
