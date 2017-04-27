const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");
var User = require("../models/user");

router.get("/ponzvert/", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

router.get("/ponzvert/:id", (req, res) => {
  var parentCode = req.params.id;
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("register", { parentCode });
  }
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

router.get("/", async (req, res) => {
  if (req.user) {
    req.user.totalPoints = 0;
    let user = await req.user.populateChildren();
    console.log("user", JSON.stringify(user, null, 2));
    res.render("home");
  } else {
    res.redirect("/login");
  }
});

router.post("/login", passport.authenticate("local"), function(req, res) {
  res.redirect("/");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
