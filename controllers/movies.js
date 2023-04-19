const Movie = require('../models/movie');
const { statusCodes, messages } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NoRightsError = require('../errors/NoRightsError');
const NotFoundError = require('../errors/NotFoundError');

const getMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .populate(['owner'])
  .then((movies) => res.status(statusCodes.ok).send(movies))
  .catch(next);

const postMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      Movie.findById(movie._id)
        .populate(['owner'])
        .then((result) => res.status(statusCodes.created).send(result))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => Movie.findById(req.params._id)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError(messages.cardNotFound);
    }
    if (!movie.owner.equals(req.user._id)) {
      throw new NoRightsError(messages.notDeleted);
    }
    return movie.deleteOne()
      .then(() => res.status(statusCodes.ok).send({ message: messages.deleted }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError(messages.badRequest));
    } else {
      next(err);
    }
  });

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
