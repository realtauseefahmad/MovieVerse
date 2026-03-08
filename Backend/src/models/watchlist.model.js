const mongoose = require("mongoose")

const watchListSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movieId: {
        type: Number,
        required: true
    },
    title: String,
    poster: String
},{
    timestamps: true
})


const watchListModel = mongoose.model("Watchlist", watchListSchema)

module.exports = watchListModel