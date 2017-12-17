var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");

const passport = require("passport");

// login view
router.get("/login", (req, res) => {
	res.render("login");
});

// register view
router.get("/register", (req, res) => {
	res.render("register");
});

// logout
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

// login as existing user
router.post(
	"/login",  
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})
);

router.post("/register", (req, res, next) => {
	const { email, password, fname, lname } = req.body;
	const user = new User({ email, password, fname, lname, points: 0 });
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