const express = require("express");
const app = express();
const moment = require("moment");
// ----------------------------------------
// Handlebars
// ----------------------------------------
const expressHbs = require("express-handlebars");
const hbs = expressHbs.create({
  extname: ".hbs",
  partialsDir: "views/",
  defaultLayout: "main",
  helpers: {
    formatDate: function(date) {
      return moment(date).format("MMM Do YY");
    },
    bootstrapAlertClassFor: function(key) {
      return (
        {
          error: "danger",
          alert: "danger",
          notice: "info"
        }[key] || key
      );
    }
  }
});
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// Cookie Parser
// ----------------------------------------
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Express-Session

const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

// ----------------------------------------
// Serve Public Folder
// ----------------------------------------
app.use(express.static(__dirname + "/public"));

// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
app.use(morgan("tiny"));
app.use((req, res, next) => {
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      var capKey = key[0].toUpperCase() + key.substr(1);
      var value = JSON.stringify(req[key], null, 2);
      console.log(`${capKey}: ${value}`);
    }
  });
  next();
});

// ----------------------------------------
// Flash Messages
// ----------------------------------------
var flash = require("express-flash-messages");
app.use(flash());

// ----------------------------------------
// Mongoose
// ----------------------------------------
var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")(req).then(() => next());
  }
});

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
app.use(passport.session());

// requires the model with Passport-Local Mongoose plugged in
var User = require("./models/user");

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ----------------------------------------
// currentUser
// ----------------------------------------
app.use((req, res, next) => {
  if (req.user) res.locals.currentUser = req.user;
  next();
});

// ----------------------------------------
// Routes
// ----------------------------------------
const indexRouter = require("./routers/index");
app.use("/", indexRouter);
const shopRouter = require("./routers/shop");
app.use("/shop", shopRouter);

// ----------------------------------------
// Server
// ----------------------------------------
var port = process.env.PORT || process.argv[2] || 3000;
var host = "localhost";

var args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
