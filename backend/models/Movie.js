const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  review: String,
  rating: { type: Number, min: 1, max: 5 },
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  actors: [String],
  director: String,
  writer: String,
  genre: String,
  releaseDate: Date,
  reviews: [reviewSchema],
});

module.exports = mongoose.model("Movie", movieSchema);