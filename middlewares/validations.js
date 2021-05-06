const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.validateSignInBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': "поле email не может быть пустым",
      'string.email': "Вы ввели невалидный email",
      'string.base': "Поле email должно быть строкой",
    }),
    password: Joi.string().required().messages({
      'string.empty': "Пароль не может быть пустым",
      'string.base': "Пароль должен быть строкой",
    }),
  }).messages({
    'any.required': `Поле {#label} обязательно`
  }),
});

module.exports.validateSignUpBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.empty': "Имя не может быть пустым",
      'string.min': "Минимальная длина имени - 2 символа",
      'string.max': "Максимальная длина имени - 30 символов",
      'string.base': "Имя должно быть строкой",
    }),
    email: Joi.string().required().email().messages({
      'string.empty': "Поле email не может быть пустым",
      'string.email': "Вы ввели невалидный email",
      'string.base': "Поле email должно быть строкой",
    }),
    password: Joi.string().required().messages({
      'string.empty': "Пароль не может быть пустым",
      'string.base': "Пароль должен быть строкой",
    }),
  }).messages({
    'any.required': `Поле {#label} обязательно`
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
        return helper.message(`В поле {#label} передана невалидная ссылка`);
      }
      return value;
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helper.message(`В поле {#label} передана невалидная ссылка`);
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (!validator.isURL(value, { require_protocol: true })) {
        return helper.message(`В поле {#label} передана невалидная ссылка`);
      }
      return value;
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).messages({
    'any.required': `Поле {#label} обязательно`,
    'string.empty': `Поле {#label} не может быть пустым`,
    'string.base': `Поле {#label} дожно быть строкой`,
    'number.base': `Поле {#label} должно быть числовым`,
  }),
});

module.exports.validateMovieId = celebrate({
  params: Joi.object().keys({
    id: Joi.number().required()
  }).messages({
    'number.base': `Передан невалидный id`,
  }),
});