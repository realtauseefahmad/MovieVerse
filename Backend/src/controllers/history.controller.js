const historyModel = require("../models/history.model")

async function addToHistory(req,res) {
    try {
        const { movieId, title, poster } = req.body;

        const history = await historyModel.create({
            userId: req.user.id,
            movieId, title, poster 
        })

        res.status(201).json({
            message: "Movie added to history",
            history
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}

async function getHistory(req, res) {
    try {
        const list = await historyModel.find({
            userId: req.user.id
        }).sort({ watchedAt: -1 });
        res.status(200).json({
            success: true,
            history: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    addToHistory,
    getHistory
}