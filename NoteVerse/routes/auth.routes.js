const express = require("express");
const router = express.Router();
const {
    getLogin,
    postLogin,
    postRegister, 
    forgotPassword
    } = require("../controllers/auth.controllers");

router.get("/login", getLogin);
router.post("/login", postLogin);
//router.get("/register", getRegister);
router.post("/register", postRegister);
router.post("/forgotpassword",forgotPassword)

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      res.json({ error: err });
    } else res.send("Logout successful!")
  });
});

module.exports = router;