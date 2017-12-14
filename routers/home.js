const express = require("express");
const app = express();
const router = express.Router();
const User = require("./../models/User");
const mongoose = require("mongoose");
const passport = require("passport");

// 1
const findTree = async function(user, distance) {
  let usrArr = await User.find({
    referrer: user._id
  });
  console.log("user", user, "userid", user._id);
  console.log(usrArr);
  if (usrArr === []) {
    return [user.username, distance];
  } else {
    let recursiveArray = [];
    let temp;
    for (let i = 0; i < usrArr.length; i++) {
      temp = await findTree(usrArr[i], distance + 1);
      recursiveArray = recursiveArray.concat(temp);
    }
    // console.log("========================RECURSIVEARRAY", recursiveArray);
    // let recursiveArray = await usrArr.map(async function(x) {
    //   let y = await findTree(x, distance + 1);
    //   return y;
    // });
    recursiveArray.unshift([
      user.username,
      distance,
      user.date.toString().substring(4, 15)
    ]);
    return recursiveArray;
  }
};

const calcPoints = distance => {
  switch (distance) {
    case 1:
      return 40;
      break;
    case 2:
      return 20;
      break;
    case 3:
      return 10;
      break;
    case 4:
      return 5;
      break;
    case 5:
      return 2;
      break;
    default:
      return 1;
  }
};

router.get("/", async (req, res) => {
  let user;
  let referrer;
  let userArray;
  let pointsArray;
  let sum = 0;
  let levels;
  try {
    user = await User.findById(req.user.id);
    userArray = await findTree(user, 0);
    userArray.shift();
    // console.log(
    //   "---------------------------------------------------------------------",
    //   userArray
    // );

    userArray.forEach(
      (x, i) => (userArray[i][3] = "    ".repeat(userArray[i][1]))
    );

    levels = [];
    levels[0] = [0, 0, 1];
    userArray.forEach(x => {
      levels[x[1]] = levels[x[1]] || [0, 0, 0];
      levels[x[1]][2] += 1;
      // console.log(levels);
    });
    levels.forEach((x, i) => {
      levels[i][0] = (i + 1) * 50;
      levels[i][1] = ((levels.length - i) * 25);
      levels[i][3] = ((levels.length + 1) * 25) - 5;
    });
    userArray.forEach((x, i) => (userArray[i][1] = calcPoints(x[1])));

    userArray.forEach(x => (sum += x[1]));
    sum -= user.pointsSpent;

    if (user.referrer) {
      referrer = await User.findById(user.referrer);
    }

  } finally {
    if (req.user) {
      res.render("home", {
        referrer,
        user,
        userArray,
        sum,
        levels
      });
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
  let {
    username,
    password
  } = req.body;
  let currentUser = new User({
    username,
    password
  });
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
  const {
    username,
    password
  } = req.body;
  const user = new User({
    username,
    password
  });
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
