const router = require('express').Router();
const { deleteMovie, getMovies, addMovie } = require('../controllers/movies')

router.get('/', getMovies);
router.post('/', addMovie);
router.delete('/:id', deleteMovie);

module.exports = router