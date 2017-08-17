const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("shop/index");
});

router.post("/", (req, res) => {
  let { item, cost } = req.body;
  cost = parseInt(cost);
  const ponzPoints = req.user.AnkhMorporkDollars;
  console.log(cost);
  if (checkMoney(cost, ponzPoints)) {
    User.update(
      { _id: req.user._id },
      { $push: { goodies: item }, $inc: { AnkhMorporkDollars: cost } }
    ).then(() => {
      req.flash("Success", `The cereal is yours!`);
      res.redirect("show");
    });
  } else {
    req.flash(
      "error",
      `Not enough money! Go get rich off the backs of your friends!`
    );
    res.redirect("back");
  }
});

router.get("/show", (req, res) => {
  res.render("shop/show", { user: req.user });
});

function checkMoney(cost, money) {
  cost = -cost;
  return money > cost;
}

module.exports = router;
