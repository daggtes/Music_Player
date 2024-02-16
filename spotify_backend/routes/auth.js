const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {getToken} = require ("../utils/helpers");

// This POST route will help to register a user
router.post("/register", async (req, res)=> {
    // This code will run when the /register api is called as a POST request
    // My req.body will be of the format (email, password, firstname, lastname, username)
    const {email, password, firstName, lastName, userName} = req.body;

    // Does a user with this email already exist? if yes, we throw an error
    const user = await User.findOne({email: email});
    if (user) {
        // status code by default is 200
        return res
            .status(403)
            .json({error: "A user with this email already exists"});
    }

    // this is a valid request
    // create a new user in the DB
    // we don't store passwords in plain text.
        
    const hashedPassword = bcrypt.hash(password, 10);
    const newUserData = {
        email, 
        password: hashedPassword,
        firstName, 
        lastName, 
        userName,
    };
    const newUser = await User.create(newUserData);

    // We want to create the token to return to the user
    const token = await getToken(email, newUser);

    // return the result to the user
    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res)=> {
    //Get email and password
    const {email, password} = req.body;

    // check if a user email exist 
    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(403).json({err:"Invalid credentials"});
    }
    // If the user exists,check the password
    //this will be true or false
    const isPasswordValid =await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(403).json({err:"invalid credentials"});
    }
    // If the credentials are correct, return a token to the user
    const token = await getToken(user.email, user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;