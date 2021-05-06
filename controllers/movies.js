const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const { country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN } = req.body;
  const userId = req.user._id;

  Movie.create({ country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: userId })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Фильм с таким id уже добавлен в базу'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findOne({movieId: id})
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм с указанным id не найден.'));
      } else if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Невозможно удалить чужую запись'));
      } else {
        Movie.deleteOne({ movieId: id })
          .then((result) => res.send(result))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор фильма'));
      } else {
        next(err);
      }
    });
};
