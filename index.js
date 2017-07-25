const express = require("express");
const app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "asdf1234567890qwer"]
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Static Public Files
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require("morgan");
app.use(morgan("tiny"));
app.use((req, res, next) => {
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
    }
  });
  next();
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
const models = require("./models");
const User = models.User;

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require("express-handlebars");
const h = require("./helpers").registered;

const hbs = expressHandlebars.create({
  helpers: h,
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");

app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(email, password, done) {
      User.findOne({ email }, function(err, user) {
        console.log(user);
        if (err) return done(err);
        if (!user || !user.validPassword(password)) {
          return done(null, false, { message: "Invalid email/password" });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// ----------------------------------------
// Routes
// ----------------------------------------
const ponzIo = require("./routes/ponzio");
const login = require("./routes/login");
const logout = require("./routes/logout");
const register = require("./routes/register");

app.use("/", ponzIo);
app.use("/login", login);
app.use("/logout", logout);
app.use("/register", register);

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT || process.argv[2] || 4000;
const host = "localhost";

let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {});

app.listen.apply(app, args);

module.exports = app;
