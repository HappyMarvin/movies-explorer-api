const mongoose = require('mongoose');
require('mongoose-type-url');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 1,
  },
  director: {
    type: String,
    required: true,
    minlength: 1,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 1,
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
  },
  image: {
    required:true,
    type: mongoose.SchemaTypes.Url,
  },
  trailer: {
    required:true,
    type: mongoose.SchemaTypes.Url,
  },
  thumbnail: {
    required:true,
    type: mongoose.SchemaTypes.Url,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 1,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 1,
  },
})

module.exports = mongoose.model("movie", movieSchema);