const express = require("express");
const router = express.Router();
const ash = require("express-async-handler");
const createError = require("http-errors");

const Post = require("../models/Post");
const Category = require("../models/Category");

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", async (req, res, next) => {
	const allPosts = await Post.find();
	const categories = await Category.find();
	res.render("./forumPosts/posts", { user: req.user, allPosts, categories });
});

// router.get("/create-post", ensureAuthenticated, async (req, res, next) => {
// 	const categoryData = await Category.find();
// 	console.log(categoryData);
// 	res.render("./forumPosts/createPost", { categories: categoryData.name });
// });
router.get("/create-post", ensureAuthenticated, async (req, res, next) => {
	const categoryData = await Category.find();
	res.render("./forumPosts/createPost", {
		user: req.user,
		categories: categoryData,
	});
});

router.post(
	"/create-post",
	ash(async (req, res, next) => {
		const { postTitle, postText, category } = req.body;
		let errors = [];

		if (req.user) {
			const post = new Post({
				title: postTitle,
				body: postText,
				author: req.user.username,
				category,
			});

			await post
				.save()
				.then((p) => {
					req.flash("success_msg", "Post Created");
				})
				.catch((err) => console.log(err));
		} else {
			req.flash("error_msg", "You need to login to create Post");
			res.redirect("/login");
			throw createError(403, "Need to login");
		}
	})
);

router.get(
	"/:id",
	ash(async (req, res, next) => {
		const post = await Post.findById(req.params.id);
		const categories = await Category.find();
		let createdByUser;
		if (req.user) {
			createdByUser = req.user.username === post.author ? true : false;
		}
		res.render("./forumPosts/post", {
			user: req.user,
			post,
			createdByUser,
			categories,
		});
	})
);

router.post("/:id", (req, res, next) => {
	if (req.user) {
		const comment = {
			body: req.body.postComment,
			commenterName: req.user.username,
			commenterID: req.user.id,
		};
		Post.updateOne(
			{ _id: req.params.id },
			{ $push: { comments: comment } },
			function(error, success) {
				if (error) console.log(error);
				else {
					req.flash("success_msg", "Commented");
					res.redirect("back");
					console.log(success);
				}
			}
		);
	} else {
		req.flash("error_msg", "You need to login to comment");
		throw createError(403, "Not logged in");
	}
});

module.exports = router;
