const app = require("express")();
const exphbs = require("express-handlebars")
const hbs = exphbs.create({
  partialsDir: "views/partials",
  defaultLayout: "main"
});
const routes = require("./routes");

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


// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username }, function(err, user) {
      console.log(user);
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
}

// mount routes

app.use("/register", routes.register);

// actually start the server

app.listen(3000, () => {
	console.log("Now listening...")
})