const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../constants/config');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const { errorMessages, messages } = require('../constants/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    next(new BadRequestError(errorMessages.emptyPass));
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            {
              expiresIn: '7d',
            },
          );
          res.cookie('token', token);
          res.status(201).send(user.toJSON());
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(errorMessages.validError));
          } else if (err.code === 11000) {
            next(new ConflictError(errorMessages.userConflict));
          } else {
            next(err);
          }
        });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError(errorMessages.incorrectLogin));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError(errorMessages.incorrectLogin));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );
      res.cookie('token', token);
      res.send({ message: messages.auth });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('token').send({ message: messages.logout });
};

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorMessages.userNotFound));
      } else {
        res.send({ name: user.name, email: user.email });
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorMessages.userNotFound));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.userInvalidId));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.validError));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.userConflict));
      } else {
        next(err);
      }
    });
};
