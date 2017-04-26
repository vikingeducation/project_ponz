const express = require("express");
let router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

const User = require("../models/User");

router.get("/:referralId", loggedOutOnly, (req, res) => {
  const referralId = req.params.referralId;
  res.render("ponzvert", { referralId });
});

router.post("/", loggedOutOnly, (req, res, next) => {
  const { fname, lname, email, password, referralId } = req.body;
  const user = new User({
    fname: fname,
    lname: lname,
    email: email,
    points: 0,
    password: password,
    parent: referralId
  });
  user
    .save()
    .then(user => {
      req.login(user, err => {
        if (err) {
          throw err;
        }
        res.redirect("/");
      });
    })
    .catch(next);
});

module.exports = router;
