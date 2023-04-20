const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { messages } = require('../utils/constants');
const { validationCreateUser, validationLogin } = require('../middlewares/validator');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);
router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(messages.pageNotFound));
});

module.exports = router;
