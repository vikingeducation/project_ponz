var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");

const passport = require("passport");

router.get("/", (req, res, next) => {
	if (req.user) {	
	  res.render("home", { user: req.user });
  } else {
		res.redirect("/login");
	}
});

// referral link
router.get("/ponzvert/:referralId", (req, res) => {
	req.logout();
	User.findById(req.params.referralId).then(user => {
		res.render("referral", { id: req.params.referralId, name: `${user.fname} ${user.lname}`});
	});
});


// sign up under a friend
router.post("/ponzvert", async (req, res) => {
	// set parent with referrer id
	const { email, password, fname, lname, referralId } = req.body;
	const user = new User({ email, password, fname, lname, points: 0, parent: referralId });

	// update parent's (referrer's) children's list with current user
	await User.update({ _id: referralId }, { $push: { children: user._id } });

	// save new user, assign points and redirect
	user.save((err, user, next) => {
		user.addPoints();
		req.login(user, function(err) {
			if (err) {
				return console.error(err);
			}
			return res.redirect("/");
		});
	});
});

module.exports = router;