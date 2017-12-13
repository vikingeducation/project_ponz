const express = require("express");
const app = express();
const router = express.Router();
const User = require("./../models/User");
const mongoose = require("mongoose");
const passport = require("passport");

router.get("/", (req, res) => {
  res.redirect("/");
});

router.get("/:id", async (req, res) => {
  try {
    let user1 = await User.findById(req.params.id);
    console.log(user1);
    if (user1.referrer) {
      let user2 = await User.findById(user1.referrer);
      console.log(user2);
      if (user2.referrer) {
        let user3 = await User.findById(user2.referrer);
        if (user3.referrer) {
          let user4 = await User.findById(user3.referrer);
        }
      }
    }
  } catch (e) {
    next(e);
  }

  res.redirect(`register/${req.params.id}`);
});

module.exports = router;
