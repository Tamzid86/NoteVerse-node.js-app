import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/auth.js";
import session from 'express-session';
import passport from 'passport';
import './routes/auth.js';

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(passport.session({secret:"cats"}));
app.use(passport.session());
app.use(passport.initialize());


/*Add Routing here*/
app.use("/user", authRoute);



//MongoDB Setup
const PORT=process.env.PORT || 3001
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {

  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

  /* Oauth implementation */

  /* Middleware */
function isLoggedIn(req,res,next){
  req.user? next(): res.sendStatus(401);
}

  app.get('/oauth', (req,res)=>{
    res.send('<a href="/auth/google">Authenticate with Google</a>');
});

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
app.get('/protected', isLoggedIn, (req,res)=>{
  res.send(`Welcome to NoteVerse ${req.user.displayName}`);
})

