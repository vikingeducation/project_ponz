const app = require("express")();
const exphbs = require("express-handlebars")
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

passport.use(
  new LocalStrategy("local", function(username, password, done) {
    User.findOne({ username }, function(err, user) {
 //     console.log(user);
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

app.get("/", isAuthenticated, (req, res) => {
  User.findById(req.user.id)
  .populate({
    path: "children",
    populate: {
      path: "children",
      model: "User",
      populate: {
        path: "children",
        model: "User",
        populate: {
          path: "children",
          model: "User",
          populate: {
            path: "children",
            model: "User",
            populate: {
              path: "children",
              model: "User"
            }
          }
        }
      }
    }
  })
  .then((user)=>{
  return res.render("./index", {user:user});
  })
});

function deepPopulate (user, counter=80) {
  user.populate("children")
  .then(userWithChildren =>{
    counter = Math.floor(counter/2)
    userWithChildren.children.forEach(child=>{
      if (child.children.length) {
        deepPopulate(child, counter)
      }
      child.profit = counter
    })
    return user
  })
}


app.post("/login",
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
	console.log("Now listening...")
})