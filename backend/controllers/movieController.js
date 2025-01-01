const Movie = require("../models/Movie");
const User = require("../models/User");


exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the movie exists before deleting
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    // Remove the movie from the database
    await Movie.findByIdAndDelete(id);

    // Update all users who have this movie in their watchlist
    await User.updateMany(
      { watchlist: id },
      { $pull: { watchlist: id } } // Pull the movie ID from the watchlist
    );

    // Respond with a success message
    res.status(200).send("Movie deleted successfully and removed from users' watchlists");
  } catch (err) {
    next(err);
  }
};




exports.addReview = async (req, res, next) => {
  try {
    const { movieId, review, rating } = req.body;
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found");

    movie.reviews.push({ user: req.user._id, review, rating });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.getWatchlist = async (req, res, next) => {
  try {
    console.log("req.user:", req.user);

    const user = await User.findById(req.user.user_id).populate("watchlist");


    if (!user) {
      console.log("User not found for ID:", req.user._id);
      return res.status(404).send("User not found");
    }

    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
};



exports.updateWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body;
    
    // Check if the movie exists in the database
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).send("Movie not found"); // If the movie is not found, return an error
    }

    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isInWatchlist = user.watchlist.includes(movieId);

    if (isInWatchlist) {
      user.watchlist = user.watchlist.filter((id) => id.toString() !== movieId);
    } else {
      user.watchlist.push(movieId);
    }

    await user.save();
    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
};


