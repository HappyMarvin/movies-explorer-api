const jwt = require('jsonwebtoken');
require('dotenv').config();
const UnauthorizedError = require('../errors/unauthorized-error');
const { errorMessages } = require('../constants/constants');

const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production' ? process.env : require('../constants/config');

module.exports = (req, res, next) => {
  const { cookies } = req;
  if (!cookies || !cookies.token) {
    next(new UnauthorizedError(errorMessages.unauthorized));
  }

  const { token } = cookies;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(errorMessages.unauthorized));
  }
  req.user = payload;
  return next();
};
