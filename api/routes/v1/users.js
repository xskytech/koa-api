const Router = require('koa-router');

const UsersController = require('../../controllers/UsersController');

const router = new Router({ prefix: '/users' });

router.get('/', UsersController.getAll);
router.get('/:id', UsersController.getById);

router.post('/', UsersController.create);
router.post('/sign-in', UsersController.signIn);

router.patch('/:id', UsersController.update);

router.delete('/:id', UsersController.delete);

module.exports = router;
