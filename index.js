const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const exphbs = require("express-handlebars");
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

app.engine(
  "handlebars",
  exphbs({ defaultLayout: "main", partialsDir: "views/partials" })
);
app.set("view engine", "handlebars");

const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/project_ponz");

app.get("/", loggedInOnly, (req, res) => {
  res.render("index");
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});
app.post("/register/:id", loggedOutOnly, (req, res) => {
  let newUser = {};
  newUser.username = req.body.username;
  newUser.password = req.body.password;
  newUser.referrals = [];
  newUser.AnkhMorporkDollars = -100;
  if (req.params.id) {
    newUser.referrerID = req.params.id;
  }
  User.create(newUser).then(() => {
    return res.redirect("/");
  });

  res.render("login");
});
app.post("/login", loggedOutOnly, (req, res) => {
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === undefined) {
      return res.redirect("/login");
    }
    if (foundUser.validatePassword(req.body.password) === true) {
      const sessionId = createSignedSessionId(email);
      res.cookie("sessionId", sessionId);
      return res.redirect("/");
    } else {
      return res.redirect("/login");
    }
  });
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
