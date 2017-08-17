const express = require("express");
const app = express();
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash-messages");
// const flash = require("express-flash");

app.use(
	session({
		secret: "123fljwejflkkwjelk23jlkf23fl2k3jl23kfjlk23j329f4",
		resave: true,
		saveUninitialized: true
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const mongoose = require("mongoose");
const Promise = require("bluebird");

const localAuth = require("./auth/passport")(passport);

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

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

// express session

// handlebars view
app.set("views", path.join(__dirname, "views"));

// hbs
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main",
		helpers: {
			toJSON: function(object) {
				return JSON.stringify(object);
			}
		}
	})
);

app.set("view engine", "handlebars");

// middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api", require("./routes/api"));
app.use("/ponzvert", require("./routes/ponzvert"));
app.use("/", require("./routes/index"));
app.use("/logout", require("./routes/logout"));

app.post(
	"/login",
	passport.authenticate("local-login", {
		successRedirect: "/ponzvert",
		failureRedirect: "/",
		failureFlash: true
	})
);

// listen to server
app.listen(3000, () => {
	console.log(`Listening at port 3000`);
});
