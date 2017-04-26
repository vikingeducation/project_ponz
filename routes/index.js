const express = require("express");
let router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

const User = require("../models/User");

module.exports = passport => {
  router.get("/", loggedInOnly, (req, res, next) => {
    const user = req.user;
    res.render("index", { user });
  });

  router.get("/login", loggedOutOnly, (req, res) => {
    res.render("login");
  });

  router.get("/register", loggedOutOnly, (req, res) => {
    res.render("register");
  });

  router.get("/logout", loggedInOnly, (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  router.post(
    "/login",
    loggedOutOnly,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  router.post("/register", loggedOutOnly, async (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    const user = new User({
      fname: fname,
      lname: lname,
      email: email,
      points: 0,
      password: password
    });
    let pointArray = [40, 20, 10, 5, 2, 1];
    let counter = 0;
    await user.save();
    while (user.parent) {
      let parent = await User.findById(user.parent);
      parent.points += pointArray[counter];
      if (counter < 5) {
        counter++;
      }
    }
  });

  return router;
};
