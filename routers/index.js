const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");
var User = require("../models/user");

router.get("/ponzvert/", (req, res) => {
  res.render("register");
});

router.get("/ponzvert/:id", (req, res) => {
  var parentCode = req.params.id;
  res.render("register", { parentCode });
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
    let allChildren = [];
    let points = 0;

    let initialUser = await User.findById(req.user._id).populate("children");

    for (let i = 0; i < initialUser.children.length; i++) {
      let firstChild = await User.findById(
        initialUser.children[i]._id
      ).populate("children");
      points += 40;

      for (let j = 0; j < firstChild.children.length; j++) {
        let secondChild = await User.findById(
          firstChild.children[j]._id
        ).populate("children");
        // console.log("First: ", firstChild.children);
        // console.log("Second: ", secondChild);
        firstChild.children[j].children.push(secondChild);
        points += 20;
      }
      allChildren.push(firstChild);
      console.log("All: ", allChildren)
    }
    // console.log("all Children", allChildren);
    res.render("home", { allChildren, points });
  } else {
    res.redirect("/login");
  }
});

// router.get("/", (req, res) => {

//   if (req.user) {
//     let allChildren = [];

//     User.findById(req.user._id).populate('children')
//       .then((user) => {
//         for( let i = 0; i < user.children.length; i++ ) {
//           User.findById(user.children[i]._id).populate('children')
//             .then((user) => {
//               allChildren.push(user.children);

//             })
//         }
//         console.log("All Children array:", allChildren);
//         res.render("home")
//       })

//   } else {
//     res.redirect("/login");
//   }
// });

router.post("/login", passport.authenticate("local"), function(req, res) {
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
