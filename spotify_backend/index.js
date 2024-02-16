// npm init : package.json -- this is a node project
// npm i express : expressJS package install -- project 
// we finally use express

const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require ("passport");
const User = require("./models/User");
const authRoutes = require ("./routes/auth");
const songRoutes = require ("./routes/song");
const playlistRoutes = require ("./routes/playlist");
const app = express();
require("dotenv").config();
const port = 8000;

app.use(express.json());

// connect mongodb to our node app
// mongoose.connect() takes 2 argument : 1. which db to connect to (db url), 
// 2.connection options
mongoose
    .connect(
        "mongodb+srv://valttesfaye:" 
            + process.env.MONGO_PASSWORD + 
            "@cluster0.fixprwi.mongodb.net/?retryWrites=true&w=majority", 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((x) => {
        console.log("Connected to Mongo!");
    })
    .catch((err) => {
        console.log("Error while connecting")
    });


// setup passport-jwt

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.sub}, function(err, user) {
            // done(error, does the user exist)
            if (err)  {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }   else  {
                return done(null, false);
                // or you could create a new account
            }
        });
    })
);

// API : GET type : / : return text 
app.get("/", (req, res) => {
    // req contains all the data for the request
    // res contains all the data for the response
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// now we run on localhost:8000
app.listen(port, () => {
    console.log("App running on port " + port);
});
