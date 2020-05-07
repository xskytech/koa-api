const Router = require('koa-router');

const BaseController = require('../../controllers/BaseController');

const usersRoutes = require('./users');

const router = new Router({ prefix: '/v1' });

router.get('/ping', BaseController.ping);

router.use(usersRoutes.routes());

module.exports = router;
