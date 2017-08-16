const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                // local strategy uses username and password
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // callback password from our form
                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                User.findOne({ username: username }, function(err, user) {
                    // if there are any errors, return the error before anything else
                    if (err) return done(err);
                    // if no user is found, return the message
                    if (!user)
                        return done(
                            null,
                            false,
                            req.flash("loginMessage", "No user found.")
                        ); // req.flash is the way to set flashdata using connect-flash
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, user.password))
                        return done(
                            null,
                            false,
                            req.flash("loginMessage", "Oops! Wrong password.")
                        ); // create the loginMessage and save it to session as flashdata
                    // all is well, return successful user
                    return done(null, user);
                });
            }
        )
    );
};
