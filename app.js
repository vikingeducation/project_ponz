const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const connect = require("./mongo");
const session = require("express-session");
const exphbs = require("express-handlebars");
const flash = require("express-flash");

const index = require("./routes/index");
const users = require("./routes/users");

const app = express();

const middleWare = require("./middleware");

//require('dotenv').config();

// view engine setup
const hbs = exphbs.create({
  defaultLayout: "main"
});
app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET || "I like pickles",
    saveUninitialized: false,
    resave: false
  })
);

app.use(middleWare.database.persist);

const passport = require("passport");
//const strategies = require('./auth-strategies');

app.use(passport.initialize());
app.use(passport.session());

app.use("/", index);
app.use("/users", users);

app.use(middleWare.database.exit);

// catch 404 and forward to error handler
app.use(middleWare.error.notFound);

// error handler
app.use(middleWare.error.handler);

module.exports = app;
