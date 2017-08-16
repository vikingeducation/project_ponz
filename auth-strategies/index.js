const mongoose = require('mongoose');
const { User } = require('../models');
const LocalStrategy = require('passport-local').Strategy;

module.exports = {
	local: new LocalStrategy(async function(username, password, done) {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false);
			}
			if (!user.validatePassword(password)) {
				return done(null, false);
			}
			return done(null, user);
		} catch (e) {
			return done(e);
		}
	}),

	serializeUser: function(user, done) {
		done(null, user.id);
	},

	deserializeUser: async function(id, done) {
		try {
			const user = await User.findById(id);
			if (!user) {
				throw (newError = new Error('No User found'));
			}
			done(undefined, user);
		} catch (err) {
			done(err);
		}
	}
};
