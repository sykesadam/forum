const express = require("express");
const router = express.Router();
const ash = require("express-async-handler");
const createError = require("http-errors");

const Post = require("../models/Post");
const Category = require("../models/Category");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

/* GET home page. */
router.get(
	"/",
	ash(async (req, res, next) => {
		const topTenPosts = await Post.find().sort("-created").limit(5);
		const categories = await Category.find();
		res.render("index", { user: req.user, topTenPosts, categories });
	})
);

router.get(
	"/category/:name",
	ash(async (req, res, next) => {
		const categories = await Category.find();
		const nameParam =
			req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
		const category = await Category.findOne({ name: nameParam });
		const posts = await Post.find({ category: nameParam });
		res.render("./forumPosts/category", {
			user: req.user,
			category,
			posts,
			categories,
		});
	})
);

router.get(
	"/search/:searchValue",
	ash(async (req, res, next) => {
		res.set("Access-Control-Allow-Origin", "*");
		const search = req.params.searchValue;
		const posts = await Post.find({
			title: { $regex: search, $options: "i" },
		});

		console.log(posts);
		res.end();
	})
);

module.exports = router;
