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

			userInfo.parents = parent.parents.slice(0)

			userInfo.parents = userInfo.parents.map(parent=>{
				parent.distance+=1;
				return parent;
			});
			userInfo.parents.unshift({distance:0, ancestor:referral._id});

			const user = new User(userInfo);
	  	return user.save()
		}).then(user => {
			newUser = user; 
			return user // .populate("parents.ancestor");
		}).then(user => {
//			console.log("line 41: user.parents = ", user.parents)
			let counter = 40;
			const updatedParents = user.parents.map(parent => {
				if (counter > 1) {
					counter = Math.floor(40 / 2 ** parent.distance);
				}
				let updateParent = User.findByIdAndUpdate(parent.ancestor, {$inc:{ponzBucks:counter}})

				return updateParent
			})
//			console.log("line 52: updatedParents = ", updatedParents)
			//save the parents
			return Promise.all(updatedParents);
		})
		.then((promisedParents) => {
//			console.log("promisedParents = ", promisedParents)
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
		// console.log(user);
		// console.log(userInfo);
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