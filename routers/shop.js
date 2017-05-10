const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Item = require("../models/item");
const { loggedOutOnly, loggedInOnly } = require("../lib/session");

router.get("/", loggedInOnly, async (req, res) => {
  req.user.totalScore = 0;
  let user = await req.user.populateChildren(req.user, 40);
  user.totalScore = req.user.totalScore - req.user.pointsSpent;
  Item.find({}).then(items => {
    res.render("shop", { items, user });
  });
});

router.post("/buy", (req, res) => {
  const { itemId, total, price } = req.body;
  console.log("price", price, "total", total);
  if (Number(price) <= Number(total)) {
    User.findByIdAndUpdate(req.user._id, {
      $push: { itemsBought: itemId },
      $inc: { pointsSpent: price }
    }).then(user => {
      req.flash("success", "You just bought an item!");
      res.redirect("/shop/redeemed");
    });
  } else {
    req.flash("error", "You don't have enough points!");
    res.redirect("/shop");
  }
});

router.get("/redeemed", loggedInOnly, (req, res) => {
  User.findById(req.user._id).populate("itemsBought").then(user => {
    res.render("redeemed", { user });
  });
});

module.exports = router;
