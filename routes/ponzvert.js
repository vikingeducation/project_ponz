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
    let distance = 0;
    while (user.parent) {
      let parent = await User.findById(user.parent);
      if (parent) {
        parent.points += _pointsByDistance(distance);
        parent.save();
        distance++;
      }
      user = parent;
    }
    req.login(newUser, err => {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

function _pointsByDistance(distance) {
  const points = [40, 20, 10, 5, 2];
  if (distance < 5) return points[distance];
  return 1;
}

module.exports = router;
