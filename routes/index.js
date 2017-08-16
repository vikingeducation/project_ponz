const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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
  router.post(h.registerPath(), async (req, res, next) => {
    try {
      const { id, username, password } = req.body;
      let user = await User.create({ id, username, password });
      let level = 1;
      let parentUser = await user.makeChild(user, level);
      while (parentUser) {
        console.log(parentUser.username);
        level += 1;
        parentUser = await parentUser.makeChild(user, level);
      }
      req.login(user, err => {
        if (err) next(err);
        else res.redirect("/");
      });
    } catch (error) {
      res.status(500).end(error.stack);
    }
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
