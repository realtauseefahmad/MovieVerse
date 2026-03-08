const User = require("../models/user.model")
const favoriteModel = require("../models/favorite.model")
const watchListModel = require("../models/watchlist.model")
const historyModel = require("../models/history.model")

async function getAllUsers(req, res) {

    try {

        const users = await User.find().select("-password")

        res.status(200).json({
            success: true,
            users
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


async function deleteUser(req, res) {

    try {

        const userId = req.params.id

        await User.findByIdAndDelete(userId)

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


async function getStats(req, res) {

    try {

        const users = await User.countDocuments()
        const favorites = await favoriteModel.countDocuments()
        const watchlist = await watchListModel.countDocuments()
        const history = await historyModel.countDocuments()

        res.status(200).json({
            success: true,
            stats: {
                users,
                favorites,
                watchlist,
                history
            }
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

module.exports = {
    getAllUsers,
    deleteUser,
    getStats
}