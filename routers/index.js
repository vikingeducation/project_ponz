const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");
var User = require("../models/user");
const { loggedOutOnly, loggedInOnly } = require("../lib/session");

router.get("/", loggedInOnly, async (req, res) => {
  let user = await req.user.populateChildren(req.user, 40);
  user.totalScore = req.user.totalScore;
  console.log("user", JSON.stringify(user, null, 2));
  res.render("home", { user });
});

router.get("/ponzvert/", loggedOutOnly, (req, res) => {
  res.render("register");
});

router.get("/ponzvert/:id", loggedOutOnly, (req, res) => {
  var parentCode = req.params.id;
  res.render("register", { parentCode });
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const parentCode = req.body.parentCode;
  const referralCode = uniqid.time();
  const user = new User({ email, referralCode });

  if (parentCode) {
    User.register(user, password, function(err, user) {
      User.update(
        { referralCode: parentCode },
        { $push: { children: user.id } }
      ).then(() => {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      });
    });
  } else {
    User.register(user, password, function(err, user) {
      if (err) {
        console.log("error while user register!", err);
        return next(err);
      } else {
        req.login(user, function() {
          console.log("user registered!");
          res.redirect("/");
        });
      }
    });
  }
});

router.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local"), function(req, res) {
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
