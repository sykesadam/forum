const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
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
