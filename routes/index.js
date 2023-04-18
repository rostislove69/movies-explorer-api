const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { messages } = require('../utils/constants');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use((req, res, next) => {
  next(new NotFoundError(messages.pageNotFound));
});

module.exports = router;
