const express = require("express");
const app = express();
const router = express.Router();
const User = require("./../models/User");
const mongoose = require("mongoose");
const passport = require("passport");

// 1
const findTree = async function(user, distance) {
  let usrArr = await User.find({ referrer: user._id });
  console.log("user", user, "userid", user._id);
  console.log(usrArr);
  if (usrArr === []) {
    return [user.username, distance];
  } else {
    let recursiveArray = [];
    let temp;
    for (let i = 0; i < usrArr.length; i++) {
      temp = await findTree(usrArr[i], distance + 1);
      recursiveArray.push(temp);
    }
    // let recursiveArray = await usrArr.map(async function(x) {
    //   let y = await findTree(x, distance + 1);
    //   return y;
    // });
    recursiveArray.unshift([user.username, distance]);
    return recursiveArray;
  }
};
router.get("/", async (req, res) => {
  let user;
  let referrer;
  let userArr;
  try {
    user = await User.findById(req.user.id);
    userArray = await findTree(user, 0);
    userArray.shift();
    console.log(
      "---------------------------------------------------------------------" +
        userArray
    );

    if (user.referrer) {
      referrer = await User.findById(user.referrer);
    }
    // userArr = await User.findAll({ referrer: user._id });

    // userArr.forEach(user => {
    //   userArr1 = await User.findAll({referrer: user._id})
    //   })
  } finally {
    if (req.user) {
      res.render("home", { referrer, user, userArray });
    } else {
      res.redirect("/login");
    }
  }
});

// 2
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/register/:id", (req, res) => {
  res.render("register");
});

// 3
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.post("/register/:id", async (req, res, next) => {
  let { username, password } = req.body;
  let currentUser = new User({ username, password });
  currentUser.referrer = req.params.id;
  currentUser.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

// 4
router.post("/register", (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

// 5
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
