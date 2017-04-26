const express = require("express");
let router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

const User = require("../models/User");
const { augmentParents } = require("../services/ponz");

router.get("/:referralId", loggedOutOnly, (req, res) => {
  const referralId = req.params.referralId;
  res.render("ponzvert", { referralId });
});

router.post("/", loggedOutOnly, async (req, res, next) => {
  const { fname, lname, email, password, referralId } = req.body;
  let newUser = new User({
    fname: fname,
    lname: lname,
    email: email,
    points: 0,
    password: password,
    parent: referralId
  });
  let user = await newUser.save();

  if (user) {
    augmentParents(user);
    req.login(newUser, err => {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
