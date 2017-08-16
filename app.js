const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./session/Session.js");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

app.set("view engine", "hbs");

const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/project_ponz");

app.get("/", loggedInOnly, (req, res) => {
  res.render("index");
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
