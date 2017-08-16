const SECRET = process.env["secret"] || "puppies";
const md5 = require("md5");
const User = require("./../models/User");

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/");
  }
};

const generateSignature = username => md5(username + SECRET);

const createSignedSessionId = username => {
  return `${username}:${generateSignature(username)}`;
};

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  //const username = sessionId;
  const [username, signature] = sessionId.split(":");
  console.log("beforebefore");
  console.log(username);
  console.log(signature);
  User.findOne({ username: username }, (err, user) => {
    console.log("before sig block");
    if (signature === generateSignature(username)) {
      console.log("in sig block");
      req.user = user;
      res.locals.CurrentUser = user;
      next();
    } else {
      res.send("You've tampered with your cookie!");
    }
  });
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
};
