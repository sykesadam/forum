const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const createError = require("http-errors");
const ash = require("express-async-handler");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// User Model
const User = require("../models/User");
const Category = require("../models/Category");

router.get(
	"/register",
	ash(async (req, res, next) => {
		const categories = await Category.find();
		res.render("./user/register", { categories });
	})
);

router.get(
	"/profile",
	ensureAuthenticated,
	ash(async (req, res) => {
		const categories = await Category.find();
		res.render("./user/profile", {
			user: req.user,
			categories,
		});
	})
);

router.delete("/profile", (req, res) => {
	User.where().findOneAndDelete({ _id: req.user.id }, (err, deleted) => {
		if (err) console.log(err);
		req.flash(
			"success_msg",
			`Profile with username ${deleted.username} has been deleted`
		);
		res.redirect("back");
	});
	// console.log("okej du vill radera");
});

router.post(
	"/register",
	ash(async (req, res, next) => {
		const categories = await Category.find();
		const { username, password, password2 } = req.body;
		let errors = [];

		if (!username || !password || !password2) {
			errors.push({ msg: "Enter all fields" });
		}

		if (password != password2) {
			errors.push({ msg: "No matching password" });
			throw createError(400, "Passwords dont match");
		}

		if (password.length < 6) {
			errors.push({ msg: "Password should be at least 6 characters" });
		}

		let nameRegex = /^[a-zåäö0-9_-]+$/i;
		if (!nameRegex.test(username)) {
			errors.push({ msg: "Check name" });
		}

		if (errors.length > 0) {
			res.render("./user/register", {
				errors,
				username,
				password,
				password2,
				categories,
			});
		} else {
			await User.findOne({ username: username }).then((user) => {
				if (!user) {
					const newUser = new User({
						username,
						password,
					});

					bcrypt.hash(newUser.password, 10, function (err, hash) {
						if (err) console.log(err);
						newUser.password = hash;
						newUser.save().then((user) => {
							req.flash(
								"success_msg",
								"You are registered and can log in"
							);
							res.redirect("back");
						});
					});
				} else {
					errors.push({ msg: "Name Exists" });
					res.render("./user/register", {
						errors,
						username,
						password,
						password2,
					});
					throw createError(500, "Name already exists in database");
				}
			});
		}
	})
);

router.get("/login", function (req, res, next) {
	res.render("./user/login");
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/profile",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
});

router.get("/logout", (req, res, next) => {
	req.logout();
	req.flash("success_msg", "You're logged out");
	res.redirect("/");
});

module.exports = router;
