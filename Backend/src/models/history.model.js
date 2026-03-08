const mongoose = require("mongoose")

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    title: {
        type: String 
    },
    poster: {
        type: String 
    },
    watchedAt: {
        type: Date,
        default: Date.now 
    }
},{
    timestamps: true
})

const historyModel = mongoose.model("History", historySchema)

module.exports = historyModel