const watchListModel = require("../models/watchlist.model")

async function addToWatchlist(req, res) {

    try {
        const { movieId, title, poster } = req.body

        const isExists = await watchListModel.findOne({
            userId: req.user.id, movieId
        })

        if (isExists) {
            return res.status(400).json({
                message: "Movie already in watchlist"
            })
        }

        const watchlist = await watchListModel.create({
            userId: req.user.id,
            movieId,
            title,
            poster

        })
        res.status(201).json({
            message: "Added to watchlist",
            watchlist
        })
    } catch (err) {
        res.status(500).json({
            message: err.message 
        });
    }
}


async function getWatchlist(req,res) {
    try {
        const list = await watchListModel.find({
            userId: req.user.id 
        }).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, watchlist: list 
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error.message 
        });
    }
}

async function removeFromWatchlist(req,res){
    try {
        const { movieId } = req.params;
        await watchListModel.findOneAndDelete({ 
            userId: req.user.id, movieId 
        });
        res.status(200).json({ 
            success: true, message: "Removed from watchlist" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, message: error.message 
        });
    }
}

module.exports = {
    addToWatchlist,
    getWatchlist,
    removeFromWatchlist
}