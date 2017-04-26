const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const expressHandlebars = require("express-handlebars");

//const cleanDb = require("./seeds/clean");

var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")(req).then(() => next());
  }
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(
  expressSession({
    secret: process.env.secret || "puppies",
    saveUninitialized: false,
    resave: false
  })
);
//const helpers = require("./helpers");
var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
  //helpers: helpers.registered
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

let passport = require("./services/passports")(app);

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

// ----------------------------------------
// Error Handler
// ----------------------------------------
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.stack);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("taking calls");
});
