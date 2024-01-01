require('dotenv').config()
const User = require("./dataModels/User.model");
const express = require('express');
const session = require('express-session')
const passport = require('passport');
const Note = require("./dataModels/Note.model");
require('./controllers/auth.controllers')
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
        console.log(existingUser);
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
app.get('/getnote/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const notes = await Note.find({user_id: userId});
      if(notes.length===0){ return res.json({message:"No notes found"})}
      res.json(notes);
    } catch (error) {
      console.error('Error retrieving notes:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  app.post('/postnote/:id', async (req, res) => {
    const { title } = req.body;
    const user_id = req.params.id;
    const errors = [];
    
    if (!title) {
      errors.push("Title is required!");
    }
  
    if (errors.length > 0) {
      res.status(400).json({ error: errors });
    } else {
      const newNote = new Note({
        user_id,
        title,   
      });
      console.log(newNote);
      newNote
        .save()
        .then(() => {
          res.status(201).json({ message: "Note created!" });
        })
        .catch(() => {
          errors.push("Please try again");
          res.status(400).json({ error: errors });
        });
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