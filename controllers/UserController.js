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
			console.log("shortid: ", req.session.shortid);
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
		let parentUser = await User.findOne({ shortid: req.session.shortid });
		let id = shortid.generate();
		req.body.shortid = id;
		req.body.parent = parentUser;
		console.log("ParentUser", parentUser);

		let childUser = await User.create(req.body);

		parentUser.children.push(childUser);
		await parentUser.save();

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

/*
{  
   "confirmation":"success",
   "user":{  
      "__v":0,
      "username":"Susan2",
      "password":"$2a$12$8ExCDQLR8wglpNlOEdgIEO1IhqDXuAMcTiotJScs6frho6aPCb1AC",
      "fname":"Susan2",
      "lname":"Susan2",
      "shortid":"ByVEEQfOW",
      "_id":"5994a42bade777c8dec3cf71",
      "points":0,
      "children":[  

      ],
      "parent":{  
         "_id":"5994a3f5ade777c8dec3cf70",
         "username":"Susan",
         "password":"$2a$12$lnh4Sjo8Ih3YoG2ki45ZOOgFvmUAFMUd/1lnNUYAESxPgadGvsuMm",
         "fname":"Susan",
         "lname":"Susan",
         "shortid":"ByTxNmfO-",
         "__v":1,
         "points":0,
         "children":[  
            "5994a42bade777c8dec3cf71"
         ],
         "parent":null,
         "timestamp":"2017-08-16T19:58:45.263Z"
      },
      "timestamp":"2017-08-16T19:59:39.649Z"
   },
   "parentUser":{  
      "_id":"5994a3f5ade777c8dec3cf70",
      "username":"Susan",
      "password":"$2a$12$lnh4Sjo8Ih3YoG2ki45ZOOgFvmUAFMUd/1lnNUYAESxPgadGvsuMm",
      "fname":"Susan",
      "lname":"Susan",
      "shortid":"ByTxNmfO-",
      "__v":1,
      "points":0,
      "children":[  
         "5994a42bade777c8dec3cf71"
      ],
      "parent":null,
      "timestamp":"2017-08-16T19:58:45.263Z"
   }
}
 */
