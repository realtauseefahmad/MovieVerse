const express = require("express");
const movieController = require("../controllers/movie.controller");

const router = express.Router();

router.get("/trending", movieController.getTrendingMovies)

router.get("/search", movieController.searchMovies)

router.get("/:id/trailer", movieController.getMovieTrailer)

router.get("/:id", movieController.getMovieDetails)

module.exports = router;
