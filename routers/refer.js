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
  router.get("/:referalLink", (req, res) => {
    var referalLink = req.params.referalLink;
    res.render("login/signup", { referalLink });
  });

  router.post("/:referalLink", (req, res) => {
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
            User.findOne({
              referalLink: req.params.referalLink
            }).then(referalingUser => {
              Referal.findOne({
                username: referalingUser.username
              }).then(referals => {
                if (!referals) {
                  console.log("err");
                } else {
                  //
                  var newReferal = new Referal({
                    username: req.body.username,
                    created: "03/02/2016",
                    referals: []
                  });
                  referals.referals.push(newReferal.id);
                  referals.save(function(err) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("!@!@ SAVED");
                      newReferal.save(function(err) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("!@!@ SAVED");
                          res.redirect("/");
                        }
                      });
                    }
                  });
                }
              });
            });
          }
        });
      } else {
        var error = true;
        var referalLink = req.params.referalLink;
        res.render("login/signup", { referalLink, error });
      }
    });
  });

  return router;
};
