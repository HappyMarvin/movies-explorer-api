const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { cookies } = req;
  if (!cookies || !cookies.token) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  const { token } = cookies;
  let payload;

  try {
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'my-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
