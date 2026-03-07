const favoriteModel = require("../models/favorite.model")

async function addFavorite(req, res) {

    try {
        const { movieId, title, poster } = req.body;

        const favorite = await favoriteModel.create({
            userId: req.user.id,
            movieId,
            title,
            poster
        })

        res.status(201).json({
            success: true,
            message: "Movie added to favorites",
            favorite
        })
    } catch (error) {
        console.log("Add Favorite Error:", error)
        res.status(500).json({
            success: false,
            message: "Failed to add favorite"
        })
    }
}

async function getFavorites(req, res) {

    try {
        const favorites = await favoriteModel.find({
            userId: req.user.id
        })

        res.status(200).json({
            success: true,
            favorites
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch favorites"
        })
    }
}

async function removeFavorite(req, res){

  try {
    const movieId = req.params.id;

    await favoriteModel.findOneAndDelete({
      userId: req.user.id,
      movieId
    })

    res.status(200).json({
      success: true,
      message: "Movie removed from favorites"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove favorite"
    })
  }
}

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite
}