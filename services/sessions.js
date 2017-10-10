const secret = process.env["SECRET"] || "lavalamp";
const md5 = require("md5");
const User = require("../models/user");

var generateSignature = function(username) {
  return md5(username + secret);
};

var createSignedSessionId = function(username) {
  return `${username}:${generateSignature(username)}`;
};

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    console.log("loggedin");
    next();
  } else {
    res.redirect("/");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    console.log("loggedout");
    next();
  } else {
    res.redirect("/home");
  }
};

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [username, signature] = sessionId.split(":");

  User.findOne({ username: username }, (err, user) => {
    if (signature === generateSignature(username)) {
      req.user = user;
      res.locals.user = user;
      next();
    } else {
      res.send("You've tampered with your session!");
    }
  });
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly
};
