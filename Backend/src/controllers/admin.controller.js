const User = require("../models/user.model");
const favoriteModel = require("../models/favorite.model");
const watchListModel = require("../models/watchlist.model");
const historyModel = require("../models/history.model");
const AdminMovie = require("../models/adminMovie.model");

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function banUser(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot ban an admin" });
    }
    user.isBanned = !user.isBanned;
    await user.save();
    res.status(200).json({
      success: true,
      message: user.isBanned ? "User banned successfully" : "User unbanned successfully",
      isBanned: user.isBanned,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getStats(req, res) {
  try {
    const users = await User.countDocuments();
    const favorites = await favoriteModel.countDocuments();
    const watchlist = await watchListModel.countDocuments();
    const history = await historyModel.countDocuments();
    const adminMovies = await AdminMovie.countDocuments();
    res.status(200).json({
      success: true,
      stats: { users, favorites, watchlist, history, adminMovies },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Admin movies CRUD
async function getAdminMovies(req, res) {
  try {
    const movies = await AdminMovie.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function addAdminMovie(req, res) {
  try {
    const {
      title,
      posterUrl,
      description,
      movieId,
      releaseDate,
      trailerYoutubeLink,
      genre,
      category,
    } = req.body;
    if (!title || !movieId) {
      return res.status(400).json({
        success: false,
        message: "Title and Movie ID are required",
      });
    }
    const existing = await AdminMovie.findOne({ movieId: String(movieId) });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A movie with this Movie ID already exists",
      });
    }
    const movie = await AdminMovie.create({
      title,
      posterUrl: posterUrl || "",
      description: description || "Description not available",
      movieId: String(movieId),
      releaseDate: releaseDate || "",
      trailerYoutubeLink: trailerYoutubeLink || "",
      genre: genre || "",
      category: category || "movie",
    });
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateAdminMovie(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      posterUrl,
      description,
      movieId,
      releaseDate,
      trailerYoutubeLink,
      genre,
      category,
    } = req.body;
    const movie = await AdminMovie.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title }),
        ...(posterUrl !== undefined && { posterUrl }),
        ...(description !== undefined && { description }),
        ...(movieId !== undefined && { movieId: String(movieId) }),
        ...(releaseDate !== undefined && { releaseDate }),
        ...(trailerYoutubeLink !== undefined && { trailerYoutubeLink }),
        ...(genre !== undefined && { genre }),
        ...(category !== undefined && { category }),
      },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteAdminMovie(req, res) {
  try {
    const { id } = req.params;
    const movie = await AdminMovie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getAllUsers,
  banUser,
  deleteUser,
  getStats,
  getAdminMovies,
  addAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
};
