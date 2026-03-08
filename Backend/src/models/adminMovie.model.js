const mongoose = require('mongoose');

const adminMovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  posterUrl: { type: String, default: '' },
  description: { type: String, default: 'Description not available' },
  movieId: { type: String, required: true, unique: true },
  releaseDate: { type: String, default: '' },
  trailerYoutubeLink: { type: String, default: '' },
  genre: { type: String, default: '' },
  category: { type: String, default: 'movie' },
}, { timestamps: true });

module.exports = mongoose.model('AdminMovie', adminMovieSchema);
