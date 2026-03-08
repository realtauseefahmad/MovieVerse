const express = require("express");
const movieController = require("../controllers/movie.controller");

const router = express.Router();

router.get("/trending", movieController.getTrendingMovies);
router.get("/popular", movieController.getPopularMovies);
router.get("/tv/trending", movieController.getTrendingTV);
router.get("/tv/popular", movieController.getPopularTV);
router.get("/search", movieController.searchMovies);
router.get("/search/multi", movieController.searchMulti);
router.get("/tv/:id/trailer", movieController.getTVTrailer);
router.get("/tv/:id", movieController.getTVDetails);
router.get("/person/:id", movieController.getPersonDetails);
router.get("/:id/trailer", movieController.getMovieTrailer);
router.get("/:id", movieController.getMovieDetails);

module.exports = router;
