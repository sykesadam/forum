const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	title: String,
	body: String,
	author: String,
	category: String,
	meta: {
		votes: Number,
		favs: Number,
	},
	comments: [
		{
			body: String,
			commenterName: String,
			commenterID: String,
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
	created: {
		type: Date,
		default: Date.now,
	},
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
