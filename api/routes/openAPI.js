const Router = require('koa-router');
const koaSwagger = require('koa2-swagger-ui');

const openAPISpecification = require('./openAPISpecification.json');

const router = new Router({ prefix: '/openapi' });

router.use(koaSwagger());

router.get('/', koaSwagger({
  title: 'API Documentation',
  routePrefix: false,
  swaggerOptions: {
    url: '/openapi/specification',
  },
}));
router.get('/specification', ctx => ctx.ok(openAPISpecification));

module.exports = router;
