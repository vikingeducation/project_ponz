const express = require("express");
const router = express.Router();
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

const updateElders = async elder => {
  try {
    let promises = [];
    let level = 0;
    while (elder) {
      elder.ponzPoints += awardPoints(level++);
      promises.push(elder.save());
      elder = await User.findById(elder.elder);
    }
    return promises;
  } catch (e) {
    throw e;
  }
};

const populateChildren = async user => {
  try {
    let popChildren = [];
    for (let child of user.children) {
      child = await User.findById(child);
      child.children = populateChildren(child);
      popChildren.push(child);
    }
    user.children = popChildren;
    return user;
  } catch (e) {
    console.error(e);
  }
};

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

// Route Handlers
function authenticate(passport) {
  //main page
  router.get("/", ensureAuthenticated, async (req, res) => {
    try {
      const referPath = `${req.protocol}://${req.get("host")}/${req.user
        .shortId}`;

      let popUser = await User.findById(req.user.id);
      popUser = await populateChildren(popUser);
      res.render("index", { referPath, popUser });
    } catch (e) {
      res.status(500).end(e.stack);
    }
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
        User.findOne({ shortId: id }).populate("elder")
      ];
      let [user, elder] = await Promise.all(createOps);
      if (elder) {
        elder.children.push(user._id);
        user.elder = elder;
        let promises = await updateElders(elder);
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
