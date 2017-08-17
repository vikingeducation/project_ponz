const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const exphbs = require("express-handlebars");
const pyramid = require("./pyramid");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./session/Session.js");
var payOut = require("./moneyLogic");
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
app.use(loginMiddleware);
const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/project_ponz");

app.get("/", loggedInOnly, (req, res) => {
  User.findOne({ username: req.user.username }).then(user => {
    pyramid(user._id).then(results => {
      console.log("root results");
      console.log(JSON.stringify(results, null, 2));
    });
    return res.render("index", { user });
  });
});

app.get("/login", loggedOutOnly, (req, res) => {
  res.render("login");
});
app.get("/money", loggedInOnly, (req, res) => {
  payOut(req.user.referrerId);
  // res.render("login");
});
app.get("/logout", loggedInOnly, (req, res) => {
  res.cookie("sessionId", "");
  res.redirect("/");
});

app.get("/register/:id", (req, res) => {
  res.render("register", { id: req.params.id });
});

app.post("/register/:id", loggedOutOnly, (req, res) => {
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === null) {
      let newUser = {};
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.referrals = [];
      newUser.AnkhMorporkDollars = -100;
      if (req.params.id !== "new") {
        newUser.referrerId = req.params.id;
      } else {
        newUser.referrerId = 1;
      }
      User.create(newUser).then(newUser => {
        const sessionId = createSignedSessionId(newUser.username);
        res.cookie("sessionId", sessionId);
        payOut(newUser.referrerId, newUser.id);
        return res.redirect("/");
      });
    } else {
      return res.redirect("/login");
    }
  });
});

app.post("/login", loggedOutOnly, (req, res) => {
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === null) {
      return res.redirect("/login");
    }
    if (foundUser.validatePassword(req.body.password)) {
      const sessionId = createSignedSessionId(foundUser.username);
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
