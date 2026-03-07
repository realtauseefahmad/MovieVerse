const mongoose = require("mongoose")


const favoriteSchema = new mongoose.Schema({
    userId: {
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
}, {
    timestamps: true
});

const favoriteModel = mongoose.model("Favorite" , favoriteSchema)

module.exports = favoriteModel
