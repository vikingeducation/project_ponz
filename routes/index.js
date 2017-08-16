const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const h = require("../helpers");
const { User } = require("../models");

const pointSystem = {
  0: 40,
  1: 20,
  2: 10,
  3: 5,
  4: 2
};

const awardPoints = function(level) {
  if (level > 4) {
    return 1;
  } else {
    return pointSystem[level];
  }
};

const updateAncestors = (anc, promises) => {
  anc.user.ponzPoints += awardPoints(anc.level);
  anc.user.depth += 1;
  promises.push(anc.user.save());
};

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

function authenticate(passport) {
  //main page
  router.get("/", ensureAuthenticated, (req, res) => {
    const referPath = `${req.protocol}://${req.get("host")}/${req.user
      .shortId}`;
    res.render("index", { referPath });
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
      let createOps = [
        User.create({ username, password }),
        User.findOne({ shortId: id }).populate("ancestors.user")
      ];
      let [user, parent] = await Promise.all(createOps);
      console.log(parent);
      if (parent) {
        let newAncestors = parent.ancestors.slice(0);
        parent.children.push(user._id);
        newAncestors.push({ level: 0, user: parent });
        let promises = [];
        newAncestors = newAncestors.map((a, ix) => {
          return {
            level: a.level + 1,
            user: a.user
          };
        });
        parent.ancestors.forEach(anc => {
          updateAncestors(anc, promises);
        });
        updateAncestors({ level: 0, user: parent }, promises);
        user.ancestors = newAncestors;
        promises.push(user.save());
        await Promise.all(promises);
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
