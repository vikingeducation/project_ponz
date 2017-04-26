const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");
var User = require("../models/user");

router.get("/ponzvert/", (req, res) => {
  res.render("register");
});

router.get("/ponzvert/:id", (req, res) => {
  var parentCode = req.params.id;
  res.render("register", { parentCode });
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const parentCode = req.body.parentCode;
  const referralCode = uniqid.time();
  const user = new User({ email, password, referralCode });
  if (parentCode) {
    user.save().then(user => {
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
    user.save().then(() => {
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    });
  }
});

router.get("/", (req, res) => {
  console.log("user", req.user);
  if (req.user) {
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
    // failureFlash: true
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
