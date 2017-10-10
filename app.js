if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");
var app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
var cookieParser = require("cookie-parser");

app.use(cookieParser());

// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
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
var expressHandlebars = require("express-handlebars");

var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Require our User model and Session helpers
var User = require("./models/user");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./services/sessions");

// Mount our custom loginMiddleware
app.use(loginMiddleware);

// ----------------------------------------
// Routes
// ----------------------------------------

var loginRouter = require("./routers/login")(app);
app.use("/", loginRouter);
var ponzRouter = require("./routers/home")(app);
app.use("/home", loggedInOnly, ponzRouter);
var referRouter = require("./routers/refer")(app);
app.use("/ponzvert", loggedOutOnly, referRouter);
// ----------------------------------------
// Server
// ----------------------------------------
// var port = process.env.PORT || process.argv[2] || 3000;
// var host = "localhost";
//
// var args;
// process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
//
// args.push(() => {
//   console.log(`Listening: http://${host}:${port}`);
// });
//
// app.listen.apply(app, args);
app.listen(3000, console.log("Listening to port 3000"));

module.exports = app;
