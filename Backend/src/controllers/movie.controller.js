const axios = require("axios");

async function getTrendingMovies(req, res) {
    try {

        const response = await axios.get(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`
        );

        res.status(200).json({
            success: true,
            movies: response.data.results
        });

    } catch (error) {
        console.log(error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movies"
        });
    }
}

async function searchMovies(req, res) {
    try {

        const query = req.query.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            })
        }

        const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${process.env.TMDB_API_KEY}`
        )

        const data = await response.json();

        res.status(200).json({
            success: true,
            results: data.results
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search movies"
        })
    }
}

async function getMovieDetails(req, res) {
    try {

        const { id } = req.params;

        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}`,
            {
                params: {
                    api_key: process.env.TMDB_API_KEY
                }
            }
        )

        res.status(200).json({
            success: true,
            movie: response.data
        })

    } catch (error) {

        console.log("MOVIE DETAILS ERROR:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch movie details"
        })

    }
}

async function getMovieTrailer(req, res) {
    try {
        const movieId = req.params.id;

        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.TMDB_API_KEY}`
        )

        const data = await response.json();

        const trailer = data.results.find(
            video => video.type === "Trailer" && video.site === "YouTube"
        )

        if (!trailer) {
            return res.status(404).json({
                success: false,
                message: "Trailer not found"
            })
        }
        res.status(200).json({
            success: true,
            trailerKey: trailer.key
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch trailer"
        })
    }
}

module.exports = {
    getTrendingMovies,
    searchMovies,
    getMovieDetails,
    getMovieTrailer
};