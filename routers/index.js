const express = require("express");
var router = express.Router();
var uniqid = require("uniqid");

router.get("/ponzvert/", (req, res) => {
  res.render("register");
});

router.get("/ponzvert/:id", (req, res) => {
  var parentCode = req.params.id;
  res.render("register", { parentCode });
});

router.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  const parentCode = req.body.parentCode;
  const referralCode = uniqid.time();
  const user = new User({ username, password });
  user.save((err, user) => {
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  });
});

module.exports = router;
