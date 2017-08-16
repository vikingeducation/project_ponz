const { User } = require("../models");
const shortid = require("shortid");

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

	createUser: async (req, res) => {
		// check if user exists
		let existingUser;
		try {
			existingUser = await User.findOne({
				username: req.body.username
			});

			if (existingUser) {
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
				return;
			}

			let id = shortid.generate();
			req.body.shortid = id;

			let user = await User.create(req.body);
			return res.json({
				confirmation: "success",
				user: user
			});
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
	try {
		const parentUser = await User.findOne({ shortid: req.session.shortid });
		const id = shortid.generate();
		req.body.shortid = id;
		req.body.parent = parentUser._id;

		const childUser = await User.create(req.body);

		await User.findByIdAndUpdate(parentUser._id,
		{ $push: { "children": childUser._id } },
		{ "new": true, "upsert": true } )

		// console.log("parentuser", parentUser.populate('parent'))
		// console.log("parentuser", parentUser.populate('parent').parent)
		updatePoints(parentUser, 40);

		return res.json({
			confirmation: "success",
			user: childUser,
			parentUser: parentUser
		});
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
		console.log("parentUser", parentUser);
		if(!parentUser) return;
		await User.findByIdAndUpdate(parentUser._id,
			{ $inc: { 'points': points } }
		)
		newParentUser = await parentUser.populate('parent');
		// console.log(newParentUser, "newParentUser");
		if(points > 1) {
			points /= 2;
		}
	} catch(err) {
		console.error(err);
	}
	return updatePoints(newParentUser, points);
}
