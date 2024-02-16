const mongoose = require("mongoose");
// how to create a model
// require mongoose, create a mongoose schema (structure of a user)
// create a model

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName:{
        type:String,
        required: false,
    },
    email: {
        type:String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    likedSongs: {
        // we will change this to arry
        type: String,
        default: "",
    },
    likedPlaylists: {
        // we will change this to arry
        type: String,
        default: "",
    },
    subcribedArtists: {
        // we will change this to arry
        type: String,
        default: "",
    },
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;