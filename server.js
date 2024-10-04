const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT ||5000;


app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Set up multer with file size limit (for 1 GB file size)
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 * 1024 } // 1 GB file size limit
});

// Increase payload size limit for JSON and URL-encoded data
app.use(express.json({ limit: '1gb' }));  // Set body parser limit to 1GB for JSON payloads
app.use(express.urlencoded({ limit: '1gb', extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/socialhub', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Post schema and model
const postSchema = new mongoose.Schema({
    name: String,
    title: String,
    content: String,
    file: String,
    likes: { type: Number, default: 0 },
    comments: [{ text: String }],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Initialize liked posts storage
const likedPosts = {};

// Routes for fetching, creating, liking, commenting on posts, and searching

// Fetch all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch recent posts
app.get('/api/posts/recent', async (req, res) => {
    try {
        const recentPosts = await Post.find({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        res.json(recentPosts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new post with file upload
app.post('/api/posts', upload.single('file'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const file = req.file ? req.file.filename : undefined;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required fields' });
        }

        const post = new Post({ title, content, file });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Like a post
app.post('/api/posts/like/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const userIP = req.ip;

        if (likedPosts[postId] && likedPosts[postId].includes(userIP)) {
            return res.status(400).json({ error: "You have already liked this post." });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.likes += 1;
        await post.save();

        if (!likedPosts[postId]) {
            likedPosts[postId] = [userIP];
        } else {
            likedPosts[postId].push(userIP);
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a comment to a post
app.post('/api/posts/comment/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { text } = req.body;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({ text });
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Search for posts by title or content
app.get('/api/search', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found' });
        }

        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
