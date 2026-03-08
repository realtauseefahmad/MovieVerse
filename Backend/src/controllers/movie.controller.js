const axios = require("axios");
const AdminMovie = require("../models/adminMovie.model");

const TMDB_BASE = "https://api.themoviedb.org/3";

function getTmdb(url, params = {}) {
  return axios.get(url, { params: { api_key: process.env.TMDB_API_KEY, ...params } });
}

function youtubeUrlToKey(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const vMatch = trimmed.match(/(?:v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return vMatch ? vMatch[1] : null;
}

async function getTrendingMovies(req, res) {
  try {
    const page = req.query.page || 1;
    const response = await getTmdb(`${TMDB_BASE}/trending/movie/week`, { page });
    res.status(200).json({
      success: true,
      movies: response.data.results,
      totalPages: response.data.total_pages,
      page: response.data.page,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch movies" });
  }
}

async function getPopularMovies(req, res) {
  try {
    const page = req.query.page || 1;
    const response = await getTmdb(`${TMDB_BASE}/movie/popular`, { page });
    res.status(200).json({
      success: true,
      movies: response.data.results,
      totalPages: response.data.total_pages,
      page: response.data.page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch popular movies" });
  }
}

async function getTrendingTV(req, res) {
  try {
    const page = req.query.page || 1;
    const response = await getTmdb(`${TMDB_BASE}/trending/tv/week`, { page });
    res.status(200).json({
      success: true,
      results: response.data.results,
      totalPages: response.data.total_pages,
      page: response.data.page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch trending TV" });
  }
}

async function getPopularTV(req, res) {
  try {
    const page = req.query.page || 1;
    const response = await getTmdb(`${TMDB_BASE}/tv/popular`, { page });
    res.status(200).json({
      success: true,
      results: response.data.results,
      totalPages: response.data.total_pages,
      page: response.data.page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch popular TV" });
  }
}

async function searchMovies(req, res) {
  try {
    const query = req.query.query;
    const page = req.query.page || 1;
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
    const response = await getTmdb(`${TMDB_BASE}/search/movie`, { query, page });
    res.status(200).json({
      success: true,
      results: response.data.results,
      totalPages: response.data.total_pages,
      page: response.data.page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to search movies" });
  }
}

async function searchMulti(req, res) {
  try {
    const query = req.query.query;
    const page = req.query.page || 1;
    if (!query) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
    const response = await getTmdb(`${TMDB_BASE}/search/multi`, { query, page });
    const results = (response.data.results || []).filter(
      (r) => r.media_type === "movie" || r.media_type === "tv" || r.media_type === "person"
    );
    res.status(200).json({
      success: true,
      results,
      totalPages: response.data.total_pages || 1,
      page: response.data.page || 1,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to search" });
  }
}

async function getMovieDetails(req, res) {
  try {
    const { id } = req.params;
    const adminMovie = await AdminMovie.findOne({ movieId: String(id) });
    if (adminMovie) {
      const movie = {
        id: adminMovie.movieId,
        title: adminMovie.title,
        poster_path: adminMovie.posterUrl ? null : null,
        poster_url: adminMovie.posterUrl,
        overview: adminMovie.description || "Description not available",
        release_date: adminMovie.releaseDate,
        trailerYoutubeLink: adminMovie.trailerYoutubeLink,
        genre: adminMovie.genre,
        category: adminMovie.category,
        isAdminMovie: true,
      };
      return res.status(200).json({ success: true, movie });
    }
    const response = await getTmdb(`${TMDB_BASE}/movie/${id}`);
    const m = response.data;
    res.status(200).json({
      success: true,
      movie: {
        ...m,
        overview: m.overview || "Description not available",
      },
    });
  } catch (error) {
    console.log("MOVIE DETAILS ERROR:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch movie details" });
  }
}

async function getTVDetails(req, res) {
  try {
    const { id } = req.params;
    const response = await getTmdb(`${TMDB_BASE}/tv/${id}`);
    const t = response.data;
    res.status(200).json({
      success: true,
      movie: {
        ...t,
        title: t.name,
        release_date: t.first_air_date,
        overview: t.overview || "Description not available",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch TV details" });
  }
}

async function getPersonDetails(req, res) {
  try {
    const { id } = req.params;
    const response = await getTmdb(`${TMDB_BASE}/person/${id}`);
    res.status(200).json({ success: true, person: response.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch person details" });
  }
}

async function getTVTrailer(req, res) {
  try {
    const { id } = req.params;
    const response = await getTmdb(`${TMDB_BASE}/tv/${id}/videos`);
    const trailer = (response.data.results || []).find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (!trailer) {
      return res.status(404).json({
        success: false,
        message: "Trailer for this movie is currently unavailable.",
      });
    }
    res.status(200).json({ success: true, trailerKey: trailer.key });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Trailer for this movie is currently unavailable.",
    });
  }
}

async function getMovieTrailer(req, res) {
  try {
    const movieId = req.params.id;
    const adminMovie = await AdminMovie.findOne({ movieId: String(movieId) });
    if (adminMovie && adminMovie.trailerYoutubeLink) {
      const key = youtubeUrlToKey(adminMovie.trailerYoutubeLink);
      if (key) {
        return res.status(200).json({ success: true, trailerKey: key });
      }
    }
    const response = await axios.get(
      `${TMDB_BASE}/movie/${movieId}/videos`,
      { params: { api_key: process.env.TMDB_API_KEY } }
    );
    const trailer = (response.data.results || []).find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    if (!trailer) {
      return res.status(404).json({
        success: false,
        message: "Trailer for this movie is currently unavailable.",
      });
    }
    res.status(200).json({ success: true, trailerKey: trailer.key });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Trailer for this movie is currently unavailable.",
    });
  }
}

module.exports = {
  getTrendingMovies,
  getPopularMovies,
  getTrendingTV,
  getPopularTV,
  searchMovies,
  searchMulti,
  getMovieDetails,
  getTVDetails,
  getPersonDetails,
  getTVTrailer,
  getMovieTrailer,
};
