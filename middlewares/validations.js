const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { errorMessages } = require('../constants/constants');

module.exports.validateSignInBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': errorMessages.emptyEmail,
      'string.email': errorMessages.invalidEmail,
      'string.base': errorMessages.emailNoString,
    }),
    password: Joi.string().required().messages({
      'string.empty': errorMessages.emptyPass,
      'string.base': errorMessages.passNoString,
    }),
  }).messages({
    'any.required': errorMessages.anyRequired,
  }),
});

module.exports.validateSignUpBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': errorMessages.nameEmpty,
        'string.min': errorMessages.nameMin,
        'string.max': errorMessages.nameMax,
        'string.base': errorMessages.nameNoString,
      }),
    email: Joi.string().required().email().messages({
      'string.empty': errorMessages.emptyEmail,
      'string.email': errorMessages.invalidEmail,
      'string.base': errorMessages.emailNoString,
    }),
    password: Joi.string().required().messages({
      'string.empty': errorMessages.emptyPass,
      'string.base': errorMessages.passNoString,
    }),
  }).messages({
    'any.required': errorMessages.anyRequired,
  }),
});

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': errorMessages.nameEmpty,
        'string.min': errorMessages.nameMin,
        'string.max': errorMessages.nameMax,
        'string.base': errorMessages.nameNoString,
      }),
    email: Joi.string().required().email().messages({
      'string.empty': errorMessages.emptyEmail,
      'string.email': errorMessages.invalidEmail,
      'string.base': errorMessages.emailNoString,
    }),
  }).messages({
    'any.required': errorMessages.anyRequired,
  }),
});

module.exports.validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    movieId: Joi.number().required(),
    image: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helper.message(errorMessages.anyNoUrl);
      }
      return value;
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helper.message(errorMessages.anyNoUrl);
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helper.message(errorMessages.anyNoUrl);
      }
      return value;
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).messages({
    'any.required': errorMessages.anyRequired,
    'string.empty': errorMessages.anyEmpty,
    'string.base': errorMessages.anyNoString,
    'number.base': errorMessages.anyNoNumber,
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    id: Joi.number().required(),
  }).messages({
    'number.base': errorMessages.movieInvalidId,
  }),
});
