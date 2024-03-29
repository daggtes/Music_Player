const express = require ("express");
const passport = require("passport");
const Playlist = require("../models/Playlist");
const User = require("../models/User");
const Song = require("../models/Song");

const router = express.Router();

// Route 1 create a playlist
router.post(
    "/create", 
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const currentUser = req.user;
        const {name, thumbnail, songs} = req.body;
        if(!name || !thumbnail || !songs) {
            return res.status(301).json({err: "insufficent data"})
        }
        const playlistData = {
            name, 
            thumbnail, 
            songs, 
            owner: currentUser._id, 
            collaborators: []
        };
        const playlist = await Playlist.create(playlistData);
        return res.status(200).json(playlist);
    }
);

// route 2 Get a playlist by ID

router.get(
    "/get/playlist/:playlistId",
    passport.authenticate("jwt", { session: false}), 
    async (req, res) => { 
        // req params
        const playlistId = req.params.playlistId;
        // need to find a playlist with the id = playlistId
        const playlist = await Playlist.findOne({_id: playlistId});
        if(!playlist) {
            return res.status(301).json({err: "Invalid ID"});
        }
        return res.status(200).json(playlist);
    }
);

//get all playlists made by an artist
router.get(
    "/get/:artist/:artistId",
    passport.authenticate("jwt", {session: false}),
    async(req, res) => {
        const artistId = req.params.artistId;

        // Check if the srtist with the given artistId exists
        const artist = await User.findOne({_id: artistId});
        if(!artist) {
            return res.status(304).json({err: "invalid Artist ID"});
        }

        const playlists = await Playlist.find({owner:artistId});
        return res.status(200).json({data: playlists});
    }
);

// Add a song to a playlist
router.post(
    "/add/song",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        const currentUser = req.user;
        const {playlistId, songId} = req.body;
        // Get the playlist if valid
        const playlist = await Playlist.findOne({_id: playlistId});
        if(!playlist) {
            return res.status(304).json({err: "PLaylist does not exist"});
        }
        // check if the current user owns the playlist or is a collaborator
        if (
            playlist.owner != currentUser._id &&
            playlist.collaborators.includes(currentUser._id)
        ) {
            return res.status(400).json({err: "not allowded"})
        }
        // check if the song is a valid song
        const song = await Song.findOne({_id: songId});
        if(!song) {
            return res.status(304).json({err: "Song does not exist"});
        }

        // We can now simply add the song to the playlist 
        playlist.songs.push(songId);
        await playlist.save();

        return res.status(200).json(playlist);
    }
);

module.exports = router;