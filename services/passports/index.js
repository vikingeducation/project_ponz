const passport = require("passport");
const User = require("../../models").User;
const LocalStrategy = require("passport-local").Strategy;

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(function(email, password, done) {
      User.findOne({ email }, function(err, user) {
        console.log(user);
        if (err) return done(err);
        if (!user || !user.validPassword(password))
          return done(null, false, { message: "Invalid Email/password" });
        return done(null, user);
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  });
  return passport;
};
