const SECRET = process.env["secret"] || "puppies";
const md5 = require("md5");

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

const generateSignature = email => md5(email + SECRET);

const createSignedSessionId = email => {
  return `${email}:${generateSignature(email)}`;
};

const User = require("../models/User");

const loginMiddleWare = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [email, signature] = sessionId.split(":")

  User.findOne({email}), (err, user) => {
    if (signature === generateSignature(email){
      req.user = user;
      res.locals.CurrentUser = user;
      next();
    } else {
      res.send("You've tampered with your cookie!")
    })
  }
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
}
