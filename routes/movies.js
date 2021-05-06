const router = require('express').Router();
const { deleteMovie, getMovies, addMovie } = require('../controllers/movies')
const { validateMovieBody, validateMovieId } = require('../middlewares/validations');

router.get('/', getMovies);
router.post('/', validateMovieBody, addMovie);
router.delete('/:id', validateMovieId, deleteMovie);

module.exports = router