require('dotenv').config()
const User = require("./dataModels/User.model");
const express = require('express');
const session = require('express-session')
const passport = require('passport');
require('./oauth')
const app= require("./app")
app.use(session({secret:"cats"}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/oauth', (req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

/* Middleware */
function isLoggedIn(req,res,next){
    req.user? next(): res.sendStatus(401);
}


app.get('/auth/google',
passport.authenticate('google', {scope: ['email', 'profile']}))

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    }));

app.get('/auth/failure', (req,res)=>{
    res.send('Error!!!')
});

app.get('/protected', isLoggedIn, async (req, res) => {
    const userEmail = req.user.emails && req.user.emails.length > 0 ? req.user.emails[0].value : 'Email not available';
    try {
        const existingUser = await User.findOne({ email: userEmail });

        if (!existingUser) {
            
            const name = req.user.displayName;
            const newUser = new User({
                name,
                email: userEmail,
                password:'',
            });
            await newUser.save();
        }

        res.send(`Welcome to NoteVerse, ${req.user.displayName}! Your email is: ${userEmail}`);
    } catch (error) {
        console.error('Error checking or creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.send('Error during logout');
        }
        req.session.destroy();
        res.send('Logout successful!');
    });
});


app.listen(3000)