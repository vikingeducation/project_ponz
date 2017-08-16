const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../models");

module.exports = function(passport) => {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    }, async function(req, username, password, done) {
      let user = await User.findOne({ username: username });
    }))
