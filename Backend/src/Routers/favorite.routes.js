const express = require("express")
const favoriteController = require("../controllers/favorite.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/", authMiddleware.authMiddleware, favoriteController.addFavorite)

router.get("/", authMiddleware.authMiddleware, favoriteController.getFavorites)

router.delete("/:id", authMiddleware.authMiddleware, favoriteController.removeFavorite)

module.exports = router