const { User } = require("../models");
const shortid = require("shortid");
const moment = require("moment");


module.exports = {
	index: async (req, res) => {
		try {
			const users = await User.findAll({ order: ["id"] });

			return res.json({
				confirmation: "success",
				result: users
			});
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}
	},

	view: async (req, res) => {
		const id = req.params.id;

		try {
			const user = await User.findById(id);

			return res.json({
				confirmation: "success",
				result: user
			});
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}
	},

	viewPonzvert: async (req, res) => {
		let id = req.user._id;

		// do a map user on the first user's parent
		// { user: 'Bob, parent: susan } { user:susna } 		//
		try {
			const user = await User.findById(id)
				.populate("children")
				.populate("parent");

			console.log(user, "user");

			const mapUser = user => {
				return {
					name: user.username,
					parent: user.parent ? user.parent.username : "null",
					children: user.children.map(mapUser)
				};
			};

			return res.render("ponzvert/index", { user, tree: [mapUser(user)] });
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}
	},

	// viewScheme: async (req, res) => {
	// 	let data = [ {
	// 		key];
	// 	
	// 	return res.render("scheme/index", )
	// },

	createUser: async (req, res) => {
		// check if user exists
		let existingUser;
		try {
			existingUser = await User.findOne({
				username: req.body.username
			});

			if (existingUser) {
				req.session.message = "working good";
				return res.json({
					confirmation: "fail",
					message: "user already exists"
				});
			}
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}

		// create our user with random id
		try {
			// registering for another user
			// console.log("shortid: ", req.session.shortid);
			if (req.session.shortid) {
				createChildUser(req, res);
				req.session.message = "working good";
				return;
			}

			let id = shortid.generate();
			req.body.shortid = id;

			let user = await User.create(req.body);
			req.session.message = "working good";
			return res.redirect("/ponzvert");
		} catch (e) {
			console.error(e.stack);
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}
	}
};

async function createChildUser(req, res) {
	let parentUser;
	try {
		parentUser = await User.findOne({ shortid: req.session.shortid });
		const id = shortid.generate();
		req.body.shortid = id;
		req.body.parent = parentUser._id;

		const childUser = await User.create(req.body);

		parentUser = await User.findByIdAndUpdate(
			parentUser._id,
			{ $push: { children: childUser._id } },
			{ new: true, upsert: true }
		);

		updatePoints(parentUser, 40);

		return res.redirect("/ponzvert");
	} catch (e) {
		return res.json({
			confirmation: "fail",
			message: e.message
		});
	}
}

async function updatePoints(parentUser, points) {
	let newParentUser;
	try {
		console.log(parentUser, "parentUser");
		if (!parentUser) return;
		await User.findByIdAndUpdate(parentUser._id, { $inc: { points: points } });
		newParentUser = await User.findById(parentUser.parent);

		console.log(newParentUser, "newParentUser");
		if (points > 1) {
			points /= 2;
		}
	} catch (err) {
		console.error(err);
	}
	return updatePoints(newParentUser, points);
}

// User.findOne({ _id: req.params.id }, function(err, node) {
// 	populateParents(node).then(function() {
// 		// Do something with user
// 	});
// });

// function populateParents(user) {
// 	return User.populate(user, { parent: "parent" }).then(function(user) {
// 		return user.parent ? populateParents(user.parent) : Promise.fulfill(user);
// 	});
// }
