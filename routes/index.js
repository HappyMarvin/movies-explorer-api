const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateSignUpBody, validateSignInBody } = require('../middlewares/validations');
const NotFoundError = require('../errors/not-found-error');
const { createUser, login, logout } = require('../controllers/users');

router.post('/signup', validateSignUpBody, createUser);
router.post('/signin', validateSignInBody, login);

router.use(auth);

router.get('/signout', validateSignInBody, logout);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('/', (req, res, next) => {
  next(new NotFoundError('Неверный адрес запроса'));
});

module.exports = router;
