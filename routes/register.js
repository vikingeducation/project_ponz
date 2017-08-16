const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.render("./partials/register");
});

router.post("/", (req, res, next) => {
	const userInfo = {
  	username: req.body.username,
  	password: req.body.password,
  	children: [],
  	parents: []
  }

	if (req.body.referral) {
		let referral;
		let newUser;

		User.findById(req.body.referral).then(parent => {
			referral = parent;

			userInfo.parents = parent.parents;
			userInfo.parents.unshift(parent);

			const user = new User(userInfo);
	  	return user.save()
		}).then(user => {
			newUser = user;
			return user.populate("parents")
		}).then(user => {
			let counter = 40;
			user.parents.forEach(parent => {
				parent.ponzBucks += counter;

				if (counter > 1) {
					counter = Math.floor(counter / 2);
				}
			})

			//save the parents
		})
		.then(() => {
			referral.children.push(newUser);
			return referral.save();
		})
		.then(() => {
			res.redirect("/")
		})
	} else {
		const user = new User(userInfo);
	  return user.save().then(() => {
	  	res.redirect("/");
	  });
	}
});

module.exports = router;