const SECRET = process.env["secret"];
const md5 = require("md5");
const User = require("../models/User");

const createSignedSessionId = email => {
  return `${email}:${generateSignature(email)}`;
};

const generateSignature = email => md5(email + SECRET);

const loginMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return next();

  const [email, signature] = sessionId.split(":");

  User.findOne({ email })
    .then(user => {
      if (signature === generateSignature(email)) {
        req.user = user;
        res.locals.currentUser = user;
        next();
      } else {
        // logout user for tampering with cookie
        res.cookie("sessionId", "", {expires: new Date()});
        res.redirect("/login");
      }
    });
};

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
    res.redirect("/home");
  }
};

const setCurrentUser = (req, res, next) => {
  if (req.user) {
    User.findOne({ _id: req.user.id })
      .populate('referredBy')
      .populate({
        path: 'referrals',
        populate: {
          path: 'referredUser'
        }
      })
      .then(user => {
        res.locals.currentUser = user;
        next();
      });
  } else {
    next();
  }
};

module.exports = {
  createSignedSessionId,
  loginMiddleware,
  loggedOutOnly,
  loggedInOnly,
  setCurrentUser
};
