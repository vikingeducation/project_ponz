const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");
const passport = require("passport");

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
  const user = new User({ username, password, referralCode });
  if(parentCode) {
    user.save().then((user) => {
      User.update({referralCode: parentCode}, {$push: {'children': user.id}})
      .then(() => {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      })
    })
  } else {
    user.save().then(() => {
      req.login(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })
  }
});

router.get("/", (req, res) => {
  if (req.user) {
    res.render("home");
  } else {
    res.redirect("/ponzvert");
  }
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/login", (req, res) => {
  res.render("login")
})

module.exports = router;


