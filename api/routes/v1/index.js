const Router = require('koa-router');

const router = new Router({ prefix: '/v1' });

router.get('/ping', ctx => ctx.ok({ success: true, payload: 'pong' }));

module.exports = router;
