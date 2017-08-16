const express = require("express");
const router = express.Router();
const passport = require("passport");
const { makeTreeGraphStructure } = require("../helpers");
const { User } = require("../models");

/* GET home page. */
router.get("/", async function(req, res, next) {
  // working
  const user = await User.findRecursive({ _id: req.user._id });
  const treeGraph = makeTreeGraphStructure(user);
  if (!user) {
    return next(new Error("User not found..."));
  }
  console.log("treeGraph = ", treeGraph);
  res.render("index", {
    user: user,
    userString: JSON.stringify(user, null, 2),
    treeGraph: treeGraph
  });
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});
module.exports = router;
