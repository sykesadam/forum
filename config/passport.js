const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// User model
const User = require("../models/User");

module.exports = function(passport) {
	passport.use(
		new LocalStrategy(function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: "Incorrect username.",
					});
				}

				bcrypt.compare(password, user.password, function(err, result) {
					if (result) return done(null, user);

					// if passwrod is wrong
					return done(null, false, {
						message: "Wrong Password",
					});
				});
			});
		})
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
