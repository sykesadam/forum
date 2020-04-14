const mongoose = require("mongoose");

const CategSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	admins: [String],
	created: {
		type: Date,
		default: Date.now,
	},
});

const Category = mongoose.model("Category", CategSchema);

module.exports = Category;
