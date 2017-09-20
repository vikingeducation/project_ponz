var uniqid = require("uniqid");
var User = require("../models/user");
const referralCode = uniqid.time();

const register = function(email, password, parentCode, req, res, next) {
  const user = new User({ email, referralCode });
  if (parentCode) {
    User.register(user, password, function(err, user) {
      User.update(
        { referralCode: parentCode },
        { $push: { children: user.id } }
      ).then(() => {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/");
        });
      });
    });
  } else {
    User.register(user, password, function(err, user) {
      if (err) {
        console.log("error while user register!", err);
        return next(err);
      } else {
        req.login(user, function(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    });
  }
}

module.exports = register;