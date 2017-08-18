const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");

module.exports = new LocalStrategy(function(username, password, done) {
  User.findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else done(null, user);
    })
    .catch(e => done(e));
});
