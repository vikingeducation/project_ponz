const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const flash = require("flash-connect");

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const mongoose = require("mongoose");
const Promise = require("bluebird");
const {isLoggedIn} = require("./middleware");

const localAuth = require("auth")(passport);
// const { User } = require("./models");
// const LocalStrategy = require("passport-local").Strategy;


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// const { loginTool } = require("./auth");

// bluebird mongoose
mongoose.Promise = Promise;

// connect to mongoose
const beginConnection = mongoose.connect(process.env.DB_URL, {useMongoClient: true});

beginConnection.then(db => {
  console.log("DB CONNECTION SUCCESS");
}).catch(err => {
  console.error(err);
});

// express session
app.use(session({
  secret: "123fljwejflkkwjelk23jlkf23fl2k3jl23kfjlk23j329f4",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60
  }
}));

// handlebars view
app.set("views", path.join(__dirname, "views"));

// hbs
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

// passport.use(
// 	new LocalStrategy((username, password, done) => {
// 		let user = findUser(username);
// 		if (!user) return done(null, false);
//
// 		bcrypt.compareSync(password, user.password, (err, isValid) => {
// 			if (err) return done(err);
// 			if (!isValid) return done(null, false);
// 			return done(null, user);
// 		});
// 	})
// );

// async function findUser(username) {
// 	let user;
// 	try {
// 		user = await User.findOne({
// 			username: username
// 		});
// 	} catch (error) {
// 		console.error(error);
// 	}
// 	return user;
// }

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
app.use("/api", require("./routes/api"));
app.use("/", require("./routes/index"))

app.get("/ponzvert", isLoggedIn, (req, res) => {
  res.send("the main page!");
});

app.post("/login", passport.authenticate("local-login", {
  successRedirect: "/ponzvert",
  failureRedirect: "/",
  failureFlash: true
}))

// app.get(
// 	"/auth/user",
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

// listen to server
app.listen(3000, () => {
  console.log(`Listening at port 3000`);
});
