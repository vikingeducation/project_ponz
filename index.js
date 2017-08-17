const app = require("express")();
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
	partialsDir: "views/partials",
	defaultLayout: "main"
});
const mongoose = require("mongoose");
const routes = require("./routes");
const { User } = require("./models");

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Requiring middleware
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");

// Mounting middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
	expressSession({
		secret: process.env.secret || "keyboard cat",
		saveUninitialized: false,
		resave: false
	})
);

app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

//set up Passport
passport.use(
	new LocalStrategy("local", function(username, password, done) {
		User.findOne({ username }, function(err, user) {
			if (err) return done(err);
			if (!user || !user.validPassword(password)) {
				return done(null, false, { message: "Invalid username/password" });
			}
			return done(null, user);
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// protect logged-in routes
const isAuthenticated = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		return res.redirect("/login");
	}
};

app.get("/", isAuthenticated, (req, res) => {
	const pyramid = [];
	deepPopulate(req.user, 40, pyramid, 0) // returns nestedly populated user
		.then(deeplyPopulatedUser => {
			console.log("deeplyPopulatedUser, 89: ", deeplyPopulatedUser);
			return res.render("./index", { user: deeplyPopulatedUser });
		});
});

// utils.depthOf() = function(object) {
//   var level = 1;
//   var key;
//   for(key in object) {
//   if (!object.hasOwnProperty(key)) continue;

//   if(typeof object[key] == 'object'){
//   var depth = utils.depthOf(object[key]) + 1;
//   level = Math.max(depth, level);
//   }
//   }
//   return level;
// }

// while(user.children.length) {
// 	user.children.forEach(child => {
// 		user = child
// 	})
// }

function deepPopulate(user, counter = 40) {
	return User.findById(user.id)
		.populate("children")
		.then(populatedUser => {
			console.log("Populated User: " + populatedUser);
			return Promise.all(
				populatedUser.children.map(child => {
					console.log("Child: " + child);
					child.profit = counter;
					lowerCounter = counter > 1 ? Math.floor(counter / 2) : counter;
					if (child.children.length) {
						console.log("Child's children: " + child.children);
						return deepPopulate(child, lowerCounter);
					} else {
						return child;
					}
				})
			);
		})
		.then(childArray => {
			console.log("Child array: " + childArray);
			user.children = childArray;
			return user;
		});
}

//populate children array
//check populated children array members for children of their own
//if grandchildren, populate them

// function deepPopulate (user, counter=80) {
//   return User.findById(user.id)
//   .populate({path: "children", model: "User"})
//   .then(userWithChildren => {
//   	let currentUser = userWithChildren;
//   	while(currentUser.children.length) {
//   		return populationRepeat(currentUser, counter)
//   		.then(currentChildsPopulatedChildren => {
//   			currentUser.children = currentChildsPopulatedChildren;
//   			currentUser = currentUser.children[0];

//   		})
//   	}
//     return userWithChildren;
//   }).then((results) => {
//   	console.log("Results: ", results);
//   	return(results);
//   })
// }
// function populationRepeat(userWithChildren, counter) {
// 	counter = Math.floor(counter/2)
//   return Promise.all(userWithChildren.children.map(child=>{
//   	child.profit = counter
//     if (child.children.length) {
//       return User.findById(child._id).populate({path: "children", model: "User"});
//     } else {
//     	return child;
//     }
//   }))
// }

// .populate({
//   path: "children",
//   populate: {
//     path: "children",
//     model: "User",
//     populate: {
//       path: "children",
//       model: "User",
//       populate: {
//         path: "children",
//         model: "User",
//         populate: {
//           path: "children",
//           model: "User",
//           populate: {
//             path: "children",
//             model: "User"
//           }
//         }
//       }
//     }
//   }
// })

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})
);

app.get("/logout", isAuthenticated, (req, res) => {
	req.logout();
	return res.redirect("/login");
});

// mount routes
app.use("/login", routes.login);
app.use("/register", routes.register);

// actually start the server

app.listen(3000, () => {
	console.log("Now listening...");
});
