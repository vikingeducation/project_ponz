const express = require("express");
const router = express.Router();
const { User } = require("./../models");
const shortid = require("shortid");

router.get("/", (req, res) => {
	res.render("./register");
});

router.get("/:username", (req, res) => {
	res.render("./register", {referral:req.params.username});
});

router.post("/", (req, res, next) => {
	const userInfo = {
  	username: req.body.username,
  	password: req.body.password,
  	ponzBucks: 0,
  	referralCode: shortid.generate()
  }

	if (req.body.referral) {
		let referral;
		let newUser;

		User.findOne({referralCode: req.body.referral}).then(parent => {
			referral = parent;

// Making a copy of the parent's parents
			userInfo.parents = parent.parents.slice(0);

// Increment the distance of all the parent's parents
			userInfo.parents = userInfo.parents.map( p => {
				newParent = {
					distance: p.distance + 1,
					ancestor: p.ancestor
				}
				return newParent;
			});

//Add the new user's immediate parent to the front of the new user's parents array at distance 0
			userInfo.parents.unshift({distance:0, ancestor:referral._id});

			const user = new User(userInfo);
	  	return user.save()
		}).then(user => {
			newUser = user; 
			return user 
		}).then(user => {
			let counter = 40;
			const updatedParents = user.parents.map(parent => {
// For each ancestor, reduce the counter based on distance with a floor of 1
				if (counter > 1) {
					counter = Math.floor(40 / 2 ** parent.distance);
				} 
// Add the counter to the ancestor's score
				let updateParent = User.findByIdAndUpdate(parent.ancestor, {$inc:{ponzBucks:counter}})

				return updateParent
			})
			return Promise.all(updatedParents);
		})
		.then((promisedParents) => {
//Add the new user to its (single) parent's children 
			referral.children.push(newUser);
			return referral.save();
		})
		.then(() => {
			req.login(newUser, function(err) {
	      return res.redirect("/");
	    });
		}).catch((e) => {
			req.flash("warning", `${e}`);
	  	res.redirect("back");
		})
	} else {
		const user = new User(userInfo);
	  user.save().then(user => {
	  	req.login(user, function(err) {
	      return res.redirect("/");
	    });
	  }).catch((e) => {
	  	req.flash("warning", `${e}`);
	  	res.redirect("back");
	  });
	}
});

module.exports = router;