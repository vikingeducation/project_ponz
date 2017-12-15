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

      /*
      .deepPopulate(
        "children parent"
      );
      */

      // repl test
      // User.findById('5a32b7dcdf1c7b0004a94d0d').populate({path : 'parent', populate : {path : 'parent', populate : { path : 'parent', populate : { path : 'parent', populate : { path : 'parent'}}}}}).populate({path: "children",populate: { path: "children", populate: { path: "children", populate: { path: "children", populate: { path: "children" } } } } }).then(lg)
      // new id: 5a32a490c302790004b2d67c
      // User.findById('5a32a490c302790004b2d67c').populate({path : 'parent', populate : {path : 'parent', populate : { path : 'parent', populate : { path : 'parent', populate : { path : 'parent'}}}}}).populate({path: "children",populate: { path: "children", populate: { path: "children", populate: { path: "children", populate: { path: "children" } } } } }).then(lg)
      // User.deepPopulate('parent children').then(lg);
      // User.findOne().deepPopulate('children parent').then(lg)

      /*
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
      */

      //points calculation
      let depthCount = obj => {
        let depth = 0;
        if (obj.parent) {
          depth += 1;
          depth += depthCount(obj.parent);
        }
        return depth;
      };

      // let pointsCalc = (user, depth) => {
      //   let points = 0;
      //   // if (depth === 0) {
      //   //   points = user.children.length * 40;
      //   //   user.children.forEach((childObj, idx) => {
      //   //     let childObjDepth = depthCount(childObj);
      //   //     points += pointsCalc(childObj, childObjDepth);
      //   //   });
      //   // } else if (depth === 1) {
      //   //   points = user.children.length * 40 * (0.5 * depth);
      //   //   user.children.forEach((childObj, idx) => {
      //   //     let childObjDepth = depthCount(childObj);
      //   //     points += pointsCalc(childObj, childObjDepth);
      //   //   });
      //   // } else if (depth >= 6) {
      //   //   points = 1;
      //   //   user.children.forEach((childObj, idx) => {
      //   //     let childObjDepth = depthCount(childObj);
      //   //     points += pointsCalc(childObj, childObjDepth);
      //   //   });
      //   // } else {
      //   //   points = user.children.length * 40 * (0.5 * depth);
      //   //   user.children.forEach((childObj, idx) => {
      //   //     let childObjDepth = depthCount(childObj);
      //   //     points += pointsCalc(childObj, childObjDepth);
      //   //   });
      //   // }
      //   //
      //   // return points;
      //   if (depth >= 6) {
      //     points += 1;
      //   }
      //
      //   if(user.children){
      //     user.children.forEach((obj, idx) => {
      //       console.log('this is an obj' + obj)
      //       points += obj.point;
      //
      //       let newDepth = depth + 1;
      //       points += pointsCalc(obj, newDepth);
      //     });
      //   }
      //
      //   return points;
      //
      // };

      //saving the depth to the row
      let userDepth = depthCount(user);
      user.depth = userDepth;
      await user.save();

      console.log("userDepth: " + userDepth);
      //let count = pointsCalc(user, userDepth);

      //update points value for the user
      if (userDepth == 0) {
        user.point = 999999999;
        await user.save();
      } else if (userDepth == 1) {
        user.point = 40;
        await user.save();
      } else if (userDepth == 2) {
        user.point = 20;
        await user.save();
      } else if (userDepth == 3) {
        user.point = 10;
        await user.save();
      } else if (userDepth == 4) {
        user.point = 5;
        await user.save();
      } else if (userDepth == 5) {
        user.point = 2;
        await user.save();
      } else if (userDepth >= 6) {
        user.point = 1;
        await user.save();
      }

      //gathering the total points
      let totalPoints = user => {
        let points = 0;
        if (user.children) {
          if (user.children.length > 0) {
            user.children.forEach(obj => {
              points += parseInt(obj.point);
              if (obj.children) {
                points += totalPoints(obj);
              }
            });
          }
        }
        return points;
      };
      let p = totalPoints(user).toString();

      res.render("home", {
        user: req.user,
        points: p,
        children: user.children, //needs to be a nested object
        link: `/ponvert/${req.user._id}`
        //points: count
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
