const User = require("../dataModels/User.model");
const Note  = require("../dataModels/Note.model");
const Token = require("../dataModels/Token.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require('crypto');

/*oauth*/
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     '484028685400-8makjt8qe9f9gesp2cejl3be5eing96v.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user,done){
    done(null, user);
});

passport.deserializeUser(function(user,done){
    done(null, user);
});




const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login"); 
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Log user information to the console
      console.log("User information:", user);
      return res.redirect("/welcome");
    });
  })(req, res, next);
};

const getNotes = async (req, res, next) => {

  const userId = req.user._id
   try {
    const note = await Note.find({user_id: userId});
    if(note.length === 0)
    {
      return res.status(404).json({ error: "User doesn't have any notes" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};




const getRegister = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "register.html");
  res.sendFile(filePath);
};

const postRegister = async (req, res, next) => {
  const {  email, password } = req.body;
const name= req.body.username

  console.log(name)
  console.log(email)
  console.log(password)

const errors=[]
if (!name || !email || !password ) {
  errors.push("All fields are required!");
}

if (errors.length > 0) {
  res.status(400).json({ error: errors });
} else {
  //Create New User
  User.findOne({ email: email }).then((user) => {
    if (user) {
      errors.push("User already exists with this email!");
      res.status(400).json({ error: errors });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          errors.push(err);
          res.status(400).json({ error: errors });
        } else {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              errors.push(err);
              res.status(400).json({ error: errors });
            } else {
              const newUser = new User({
                name,
                email,
                password: hash,
              });
              newUser
                .save()
                .then(() => {
                  res.redirect("/login");
                })
                .catch(() => {
                  errors.push("Please try again");
                  res.status(400).json({ error: errors });
                });
            }
          });
        }
      });
    }
  });
}
};



const postNote = async (req, res) => {
  const { title} = req.body;
  //const user_id = req.user._id
  const user_id = req.user._id
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
};

// const postNoteWithFiles = async (req, res) => {
//   const { title, text } = req.body;
//   const user_id = req.user._id;

//   const errors = [];
//   if (!title) {
//     errors.push("Title is required!");
//   }

//   if (errors.length > 0) {
//     res.status(400).json({ error: errors });
//   } else {
//     const newNote = new Note({
//       user_id,
//       title,
//       text,
//       images: req.files['images'] ? req.files['images'].map(file => file.path) : [],
//       audios: req.files['audios'] ? req.files['audios'].map(file => file.path) : [],
//     });

//     newNote
//       .save()
//       .then(() => {
//         res.status(201).json({ message: "Note created!" });
//       })
//       .catch(() => {
//         errors.push("Please try again");
//         res.status(400).json({ error: errors });
//       });
//   }
// };

const postNoteWithFiles = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'File field is required' });
    }

    const { title, text } = req.body;
    const user_id = req.user._id;

    const files = req.files;
    const newImageFiles = [];
    const newAudioFiles = [];

    const errors = [];
    if (!title ) {
      errors.push("Title is required!");
      return res.status(400).json({ error: errors });
    }

    files.forEach((file) => {
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
        newImageFiles.push(file.filename);
      } else if (['mp3', 'wav'].includes(fileExtension)) {
        newAudioFiles.push(file.filename);
      }
    });

    const newNote = new Note({
      user_id,
      title,
      text,
      images: newImageFiles,
      audios: newAudioFiles,
    });

    await newNote.save();

    res.json({ message: 'Note created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteUserNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    await Note.deleteMany({ user_id: userId });

    res.json({ message: "User's notes deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/*forget password?*/
var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  
});

const getForgotPass = async (req, res) => {
const filePath = path.join(__dirname, "..", "views", "forgotpassword.html");
res.sendFile(filePath);
};

const forgotpassword = async(req, res) => {
  const {email} = req.body;

  try {
      const userfind = await User.findOne({email:email});
          const otp = crypto.randomBytes(2).toString("hex");
                  const rtoken = new Token({ user_id: userfind._id, token: otp});
                  const setusertoken = await rtoken.save();

          console.log("here")

      if(setusertoken){
          const mailOptions = {
              from:process.env.AUTH_EMAIL,
              to:email,
              subject:"Password Reset",
              html:`<h2>Please use this OTP to reset your password</h2>
              <h1>${otp}</h1>`
          }

          transporter.sendMail(mailOptions,(error,info)=>{
              if(error){
                  console.log("error",error);
                  res.send({message:"Could not send email"})
              }else{
                  console.log("Email sent",info.response);
                  res.redirect("/passreset")
              }
          })

      }

  } catch (error) {
      console.log(error);
      res.send({message:"Invalid user"})
  }
};

const getPassReset = async (req, res) => {
const filePath = path.join(__dirname, "..", "views", "passreset.html");
res.sendFile(filePath);
};

const passreset = async(req,res)=>{

  const {otp, password} = req.body;

  try {
      const validtoken = await Token.findOne({token: otp});
      
      const validuser = await User.findOne({_id: validtoken.user_id})

      if(validuser && validtoken){
          const newpassword = await bcrypt.hash(password,10);
          //const newpassword = password;
          // const setnewuserpass = await User.updateOne({_id:validuser._id},{password:newpassword});
          await User.updateOne({_id: validuser._id}, {$set: {password: newpassword}})

          // setnewuserpass.save();
          res.send({message:"Password has been reset"})

      }else{
          res.send({message:"User does not exist"})
      }
  } catch (error) {
      res.send({error})
  }
}



module.exports = {
  getLogin,
  postLogin,
  postRegister,
  getRegister,
  getNotes,
  postNoteWithFiles,
  postNote,
  passreset,
  getPassReset,
  forgotpassword,
  getForgotPass,
  deleteUserNotes,
};

