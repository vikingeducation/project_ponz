const express = require("express");
const router = express.Router();
const h = require("../helpers");
const { User } = require("../models");

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

// Route Handlers
function authenticate(passport) {
  //main page
  router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index");
  });

  //login view
  router.get(h.loginPath(), (req, res) => {
    User.find().then(r => {
      if (!r.length) res.redirect(h.registerPath());
      else res.render("login");
    });
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
    const { id, username, password } = req.body;
    User.registerNewUser(username, password, id)
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.redirect("/");
        });
      })
      .catch(e => res.status(500).end(e));
  });

  //logout handler
  router.get(h.logoutPath(), function(req, res) {
    req.logout();
    res.redirect("/");
  });

  //referrer link handler
  router.get("/:id", (req, res) => {
    res.render("register", { id: req.params.id });
  });

  return router;
}

module.exports = authenticate;
