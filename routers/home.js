"use strict";

//==================
// home router
//==================

const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const {User} = require("./../models");
const passport = require("passport");

// 1
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id)
        .populate({
          path: "children",
          populate: {
            path: "children",
            populate: {
              path: "children",
              populate: {
                path: "children",
                populate: {
                  path: "children"
                }
              }
            }
          }
        })
        .populate({
          path: "parent",
          populate: {
            path: "parent",
            populate: {
              path: "parent",
              populate: {
                path: "parent",
                populate: {
                  path: "parent"
                }
              }
            }
          }
        });
      // repl test
      // User.findById('5a32b7dcdf1c7b0004a94d0d').populate({path : 'parent', populate : {path : 'parent', populate : { path : 'parent', populate : { path : 'parent', populate : { path : 'parent'}}}}}).populate({path: "children",populate: { path: "children", populate: { path: "children", populate: { path: "children", populate: { path: "children" } } } } }).then(lg)
      // new id: 5a32a490c302790004b2d67c
      // User.findById('5a32a490c302790004b2d67c').populate({path : 'parent', populate : {path : 'parent', populate : { path : 'parent', populate : { path : 'parent', populate : { path : 'parent'}}}}}).populate({path: "children",populate: { path: "children", populate: { path: "children", populate: { path: "children", populate: { path: "children" } } } } }).then(lg)
      let depthCount = user => {
        let depth = 0;
        if (user.parent) {
          depth += 1;
          depth += depthCount(user.parent);
        }
        return depth;
      };

      let pointsCalc = (children, divisor) => {
        if (children === undefined) {
          return 0;
        }

        let points = 0;
        if (!divisor) {
          var divisor = 1;
          console.log("divisor set!");
          points += children.length;
        } else {
          points += children.length / divisor;
        }

        children.forEach(child => {
          points += pointsCalc(child.children, divisor * 2);
        });

        return points;
      };

      let count = pointsCalc(user.children);

      res.render("home", {
        user: req.user,
        children: user.children, //needs to be a nested object
        link: `/ponvert/${req.user._id}`,
        points: count
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 2
router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
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

// 4

router.post("/register", (req, res, next) => {
  const {email, password} = req.body;
  const user = new User({email, password});
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
