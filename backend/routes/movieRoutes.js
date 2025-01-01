const express = require("express");
const {
  getMovies,
  addMovie,
  deleteMovie,
  addReview,
  getWatchlist,
  updateWatchlist,
} = require("../controllers/movieController");
const authenticate = require("../middlewares/authMiddleware");
const adminRoleCheck = require("../middlewares/roleCheck");

const router = express.Router();

router.get("/", getMovies);
router.post("/", authenticate, adminRoleCheck, addMovie);
router.delete("/:id", authenticate, adminRoleCheck, deleteMovie);
router.post("/reviews", authenticate, addReview);
router.get("/watchlist", authenticate, getWatchlist);
router.put("/watchlist", authenticate, updateWatchlist);

module.exports = router;