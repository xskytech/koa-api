const Router = require('koa-router');

const UsersController = require('../../controllers/UsersController');
const authorization = require('../../middlewares/authorization');

const router = new Router({ prefix: '/users' });

router.get('/', authorization, UsersController.getAll);
router.get('/activate', UsersController.activate);
router.get('/:id', authorization, UsersController.getById);

router.post('/', UsersController.create);
router.post('/sign-in', UsersController.signIn);
router.post('/social-auth', UsersController.socialAuth);

router.patch('/:id', authorization, UsersController.update);

router.delete('/:id', authorization, UsersController.delete);

module.exports = router;
