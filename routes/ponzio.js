const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const passport = require('passport');

router.get("/", (req, res) => {
  if (req.user) {
    console.log(req.user);
    res.render("ponzio/index", { user: req.user, children: req.user.children });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;