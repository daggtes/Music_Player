const mongoose = require("mongoose");
// how to create a model
// require mongoose, create a mongoose schema (structure of a user)
// create a model

const Playlist = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required:true,
    },
   
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",

    },
    songs:[ 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "song",
        },
     ],
     collaborators:[
        {
            type: mongoose.Types.ObjectId,
            ref:"user",
        },
     ],
});



const PlaylistModel = mongoose.model("Playlist", Playlist);

module.exports = PlaylistModel;