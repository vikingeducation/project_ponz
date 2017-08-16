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
app.use(loginMiddleware);
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
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === null) {
      console.log("didnt find a user");
      let newUser = {};
      newUser.username = req.body.username;
      newUser.password = req.body.password;
      newUser.referrals = [];
      newUser.AnkhMorporkDollars = -100;
      if (req.params.id !== "new") {
        newUser.referrerID = req.params.id;
      }
      User.create(newUser).then(newUser => {
        const sessionId = createSignedSessionId(newUser.username);
        res.cookie("sessionId", sessionId);
        console.log(sessionId);
        console.log("created a bew yser");
        return res.redirect("/");
      });
    } else {
      console.log("found a user");
      return res.redirect("/login");
    }
  });
  console.log("im getting stuck");
});
app.post("/login", loggedOutOnly, (req, res) => {
  User.findOne({ username: req.body.username }).then(foundUser => {
    if (foundUser === null) {
      console.log("didnt find a user");
      return res.redirect("/login");
    }
    if (foundUser.validatePassword(req.body.password)) {
      console.log("found a user");
      const sessionId = createSignedSessionId(foundUser.username);
      res.cookie("sessionId", sessionId);
      return res.redirect("/");
    } else {
      console.log("didnt validate");
      return res.redirect("/login");
    }
  });
});

app.listen(3000, "0.0.0.0", (req, res) => {
  console.log("listening on port 3000");
});
