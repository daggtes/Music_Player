const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User");

router.post("/create", passport.authenticate("jwt", {session: false}), async (req, res)=> {
    //req.user gets the user because of the passport.authenticate
    const {name, thumbnail, track} = req.body;
    if(!name || !thumbnail || !track) {
        return res
        .status(301)
        .json({err: "Insufficient details to create song"});
    }
    const artist = req.user._id;
    const songDetails = {name, thumbnail, track, artist};
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
});

// Get route to get all songs I have published
router.get("/get/mysongs", 
passport.authenticate("jwt", {session: false}), 
    async(req, res)=>{
        const currentUser = req.user;
        // we need to get all the songs where artist id == currentUser._id
        const songs = await Song.find({artist: req.user._id});
        return res.status(200).json({data:songs});
    }
);
// Get route to get all songs any artist has published
// Send the artist id and see all the songs that artisrt has published
router.get("/get/artist",
    passport.authenticate("jwt", {session: false}), 
    async (req, res) => {
        const {artistId} = req.body;
        // We can check if the artist does exist 
        const artist = await User.find({_id:artistId});
        if (!artist) {
            return res.status(301).json({err: "Artist does not exist"});
        }

        const songs = await Song.find({artist: artistId});
        return res.status(200).json({data: songs});
    } 
);

//Get route to get a single song by name
router.get("/get/name", 
    passport.authenticate("jwt", {session: false}), 
    async (req, res) => {
        const {songName} = req.body;
        
        const songs = await Song.find({name: songName});
        return res.status(200).json({data: songs});
    }
);
module.exports = router;