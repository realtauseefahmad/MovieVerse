const express = require("express")
const watchlistController = require("../controllers/watchlist.controller")
const authMiddleware = require("../middlewares/auth.middleware")



const router = express.Router()



router.post("/",authMiddleware.authMiddleware,watchlistController.addToWatchlist)

router.get("/",authMiddleware.authMiddleware,watchlistController.getWatchlist)

router.delete("/:movieId",authMiddleware.authMiddleware,watchlistController.removeFromWatchlist)

module.exports = router