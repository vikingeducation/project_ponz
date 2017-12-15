"use strict";

//==================
// triangle router
//==================

const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const {User} = require("./../models");
const passport = require("passport");

//for the class triangle
const autoBind = require("auto-bind");

//creating the triangle
class triangle {
  constructor() {
    this.totalObj = {};
    autoBind(this);
  }

  func(obj) {
    console.log(obj);
  }

  objToArr() {
    let totalArr = [];
    let objKeys = Object.keys(this.totalObJ);
    if (objKeys) {
      if (objKeys.length > 0) {
        objKeys.forEach(key => {
          totalArr.push(this.totalObJ[key]);
        });
      }
    }
    return totalArr;
  }
}

router.get("/", async (req, res) => {
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
      // User.deepPopulate('parent children').then(lg);
      // User.findOne().deepPopulate('children parent').then(lg)

      //depth calculation
      let depthCount = obj => {
        let depth = 0;
        if (obj.parent) {
          depth += 1;
          depth += depthCount(obj.parent);
        }
        return depth;
      };
      let userDepth = depthCount(user);

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

      //creating the triangle
      let tri = new triangle();
      tri.func(user);
      console.log("\x1b[33m", tri.totalObj);
      //let triangleArr = tri.objToArr();

      res.render("triangle", {
        triangleArr: []
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
