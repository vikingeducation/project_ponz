const express = require("express");
const passport = require("passport");
let router = express.Router();

const User = require("../models/User");

router.get("/", (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      res.render("index", user);
    })
    .catch(next);
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.post("/register", (req, res, next) => {
  const { fname, lname, email, password } = req.body;
  const user = new User({
    fname: fname,
    lname: lname,
    email: email,
    points: 0,
    depth: 0,
    password: password
  });
  user
    .save()
    .then(user => {
      req.login(user, err => {
        if (err) {
          throw err;
        }
        res.redirect("/");
      });
    })
    .catch(next);
});

module.exports = router;
