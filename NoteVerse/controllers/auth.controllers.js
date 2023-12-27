const User = require("../dataModels/User.model");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");

const getLogin = async (req, res) => {
  const filePath = path.join(__dirname, "..", "views", "login.html");
  res.sendFile(filePath);
};

const postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: '/protected',
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
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

const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ message: "Both email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: "User with this email does not exist" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(password, salt);
    user.password = hashPassword;
    await user.save();
    res.status(200).send({ message: "Password updated successfully" });
    
} catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
}
};

module.exports = {
  forgotPassword,
};



module.exports = {
  getLogin,
  postLogin,
  postRegister,
  forgotPassword
};

