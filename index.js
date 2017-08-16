const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");

// const { User } = require("./models");
// const FacebookStrategy = require("passport-facebook");
// const LocalStrategy = require('passport-local').Strategy

// const { facebookTools, linkedinTools } = require("./auth");

const app = express();
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const mongoose = require("mongoose");
const Promise = require("bluebird");

// express session
app.use(
	session({
		secret: "123fljwejflkkwjelk23jlkf23fl2k3jl23kfjlk23j329f4",
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 24 * 60 * 60
		}
	})
);

// bluebird mongoose
mongoose.Promise = Promise;

// connect to mongoose
const beginConnection = mongoose.connect(process.env.DB_URL, {
	useMongoClient: true
});

beginConnection
	.then(db => {
		console.log("DB CONNECTION SUCCESS");
	})
	.catch(err => {
		console.error(err);
	});

// handlebars view
app.set("views", path.join(__dirname, "views"));

// hbs
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//
app.use(passport.initialize());
app.use(passport.session());

// facebookTools.utilizePassport(passport, User);
// linkedinTools.utilizePassport(passport, User);

// passport.serializeUser(function(user, done) {
// 	done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
// 	User.findById(id, function(err, user) {
// 		done(err, user);
// 	});
// });

// routes
// app.use("/", require("./routes/index"));
// app.use("/landing", require("./routes/landing"));

// Facebook Routes
// app.get(
// 	"/auth/facebook",
// 	passport.authenticate("facebook", {
// 		authType: "rerequest",
// 		scope: ["public_profile"]
// 	})
// );

// app.get(
// 	"/auth/facebook/callback",
// 	passport.authenticate("facebook", { failureRedirect: "/login" }),
// 	function(req, res) {
// 		// Successful authentication, redirect home.
// 		res.redirect("/landing"); // test
// 	}
// );

// Linkedin routes
// app.get(
// 	"/auth/linkedin",
// 	passport.authenticate("linkedin", {
// 		authType: "rerequest",
// 		scope: ['r_basicprofile', 'r_emailaddress']
// 	})
// );

// app.get(
// 	"/auth/linkedin/callback",
// 	passport.authenticate("linkedin", { failureRedirect: "/login" }),
// 	function(req, res) {
// 		// Successful authentication, redirect home.
// 		res.redirect("/landing"); // test
// 	}
// );

// listen to server
app.listen(3000, () => {
	console.log(`Listening at port 3000`);
});
