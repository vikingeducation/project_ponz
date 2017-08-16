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
		// try {
		// 	let existingUser = await User.find({
		// 			username: req.body.username
		// 	});
		// 	if (existingUser) {
		// 		return res.json({
		// 			confirmation: "fail",
		// 			message: "user already exists"
		// 		});
		// 	}
		// } catch (e) {
		// 	return res.json({
		// 		confirmation: "fail",
		// 		message: e.message
		// 	});
		// }
		// console.log("Made it here");
		// if no user, create the user
		try {
			req.body.shortid = shortid.generate();
			let user = await User.create(req.body);
 			console.log("made it to the line 63");
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
