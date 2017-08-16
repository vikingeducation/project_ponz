const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

function authenticate(passport) {
  //main page
  router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index");
  });

  //login view
  router.get(h.loginPath(), (req, res) => {
    res.render("login");
  });

  //login handler
  router.post(
    h.loginPath(),
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: h.loginPath(),
      failureFlash: true
    })
  );

  //register view
  router.get(h.registerPath(), (req, res) => {
    res.render("register");
  });

  //register handler
  router.post(h.registerPath(), (req, res, next) => {
    const { username, password } = req.body;
    User.create({ username, password })
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.redirect("/");
        });
      })
      .catch(err => res.status(500).end(err.stack));
  });

  //logout handler
  router.get(h.logoutPath(), function(req, res) {
    req.logout();
    res.redirect("/");
  });

  return router;
}

module.exports = authenticate;
