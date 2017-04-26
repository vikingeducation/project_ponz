const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");
var User = require("../models/user");

router.get("/ponzvert/", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("register");
  }
});

router.get("/ponzvert/:id", (req, res) => {
  var parentCode = req.params.id;
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("register", { parentCode });
  }
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const parentCode = req.body.parentCode;
  const referralCode = uniqid.time();
  const user = new User({ email, referralCode });

  if (parentCode) {
    User.register(user, password, function(err, user) {
      User.update(
        { referralCode: parentCode },
        { $push: { children: user.id } }
      ).then(() => {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      });
    });
  } else {
    User.register(user, password, function(err, user) {
      if (err) {
        console.log("error while user register!", err);
        return next(err);
      } else {
        req.login(user, function() {
          console.log("user registered!");
          res.redirect("/");
        });
      }
    });
  }
});

router.get("/", async (req, res) => {
  if (req.user) {
    let points = 0;
    let initialUser = await User.findById(req.user._id).populate({
      path: "children",
      populate: { path: "children", populate: { path: "children" } }
    });
    let initial = await User.findById(req.user._id).populate("children");
    let allChildren = initialUser.children;

    for (let i = 0; i < initial.children.length; i++) {
      firstChild = await User.findById(initial.children[i]._id).populate(
        "children"
      );
      points += 40;

      for (let j = 0; j < firstChild.children.length; j++) {
        secondChild = await User.findById(firstChild.children[j]._id).populate(
          "children"
        );
        firstChild.children[j].children.push(secondChild);
        points += 20;

        for (let k = 0; k < secondChild.children.length; k++) {
          thirdChild = await User.findById(
            secondChild.children[k]._id
          ).populate("children");
          console.log("First child: ", firstChild);
          console.log("First child-children: ", firstChild.children);
          console.log(
            "First child-children-children: ",
            firstChild.children[j].children
          );
          console.log("First child 4: ", firstChild.children[j].children[k]);

          // firstChild.children[j].children[k].children.push(thirdChild);
          points += 10;
        }
      }
      allChildren.push(firstChild);
      // console.log("All: ", allChildren);
    }

    res.render("home", { allChildren, points });
  } else {
    res.redirect("/login");
  }
});

router.post("/login", passport.authenticate("local"), function(req, res) {
  res.redirect("/");
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
