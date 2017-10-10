var express = require("express");
var router = express.Router();
var randomstring = require("randomstring");

//mongoose
const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
var Referal = mongoose.model("Referal");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/sessions");

module.exports = app => {
  router.get("/", loggedOutOnly, (req, res) => {
    res.render("login/start");
  });

  router.post("/login", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        if (user.validatePassword(req.body.password)) {
          res.locals.user = req.body.username;
          const sessionId = createSignedSessionId(req.body.username);
          res.cookie("sessionId", sessionId);
          res.redirect("/");
        }
      } else {
        var error = true;
        res.render("login/start", { error });
      }
    });
  });

  router.post("/signup", (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
      if (!user) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password,
          referalLink: randomstring.generate(8),
          points: 0
        });
        newUser.save(function(err) {
          if (err) {
            console.log("Err");
            res.redirect("back");
          } else {
            console.log("--Saved--");
            res.locals.user = req.body.username;
            const sessionId = createSignedSessionId(req.body.username);
            res.cookie("sessionId", sessionId);
            Referal.findOne().then(referal => {
              if (!referal) {
                var newReferal = new Referal({
                  username: req.body.username,
                  created: "03/02/2016",
                  referals: []
                });
                newReferal.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("!@!@ SAVED");
                    res.redirect("/");
                  }
                });
              } else {
                console.log(referal);
                res.redirect("/logout");
              }
            });
          }
        });
      } else {
        var error = true;
        res.render("login/start", { error });
      }
    });
  });

  app.get("/logout", (req, res) => {
    res.cookie("sessionId", "");
    res.redirect("/");
  });

  return router;
};
