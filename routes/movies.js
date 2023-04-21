const router = require('express').Router();
const { validationPostMovie, validationMovieId } = require('../middlewares/validator');

const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validationPostMovie, postMovie);
router.delete('/:_id', validationMovieId, deleteMovie);

module.exports = router;
