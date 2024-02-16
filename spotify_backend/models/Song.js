const mongoose = require("mongoose");
// how to create a model
// require mongoose, create a mongoose schema (structure of a user)
// create a model

const Song = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required:true,
    },
    track: {
        type: String,
        required:true,
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"

    },
});

const SongModel = mongoose.model("Song", Song);

module.exports = SongModel;