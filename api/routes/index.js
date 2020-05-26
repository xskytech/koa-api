const Router = require('koa-router');

const config = require('../../config');

const openAPIRoutes = require('./openAPI');
const v1Routes = require('./v1');

const router = new Router();

if (config.env === 'development') {
  router.use(openAPIRoutes.routes());
}

router.use(v1Routes.routes());

module.exports = router;
