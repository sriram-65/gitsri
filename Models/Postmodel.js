// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title:{
		type:String,
		requried:true
	} ,
	content:{
		type:String,
		requried:true
	} ,
	likes: { type: Number, default: 0 },
	comments: [{ text: String }],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
