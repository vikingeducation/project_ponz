const User = require("./../models/sequelize").User;

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
			const user = await User.findById(id, {
				include: [{ model: Profile }]
			});

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
		try {
			let existingUser = await User.find({
				where: {
					$or: {
						username: req.body.username,
						email: req.body.email
					}
				}
			});
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}

		if (existingUser) {
			return res.json({
				confirmation: "fail",
				message: "user already exists"
			});
		}

		// if no user, create the user
		try {
			let user = await User.create(req.body);

			return res.json({
				confirmation: "success",
				user: user,
				profile: profile
			});
		} catch (e) {
			return res.json({
				confirmation: "fail",
				message: e.message
			});
		}
	}
};
