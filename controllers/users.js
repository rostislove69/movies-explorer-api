const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { statusCodes, messages } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotAuthError = require('../errors/NotAuthError');

const getUserProfile = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError(messages.userNotFound);
    }
    res.status(statusCodes.ok).send(user);
  })
  .catch(next);

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(statusCodes.ok).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(statusCodes.created).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(messages.badRequest));
      } else if (err.code === 11000) {
        next(new ConflictError(messages.userAlredyCreated));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotAuthError(messages.loginFailed);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new NotAuthError(messages.loginFailed);
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
            { expiresIn: '7d' },
          );
          res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUserProfile,
  updateUserInfo,
  createUser,
  login,
};
