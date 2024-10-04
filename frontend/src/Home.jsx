import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Correct modular imports

// Assuming Firebase has already been initialized elsewhere in your app
// If not, make sure to initialize Firebase at the top level of your app

function Home() {
    const [commentInput, setCommentInput] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [user, setUser] = useState(null); // State for logged-in user

    useEffect(() => {
        // Initialize Firebase Authentication and get the current user
        const auth = getAuth();
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set the logged-in user
            } else {
                setUser(null); // No user logged in
            }
        });

        // Fetch posts
        setLoading(true);
        axios
            .get("https://srirambackend.serveo.net/api/posts")
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setLoading(false);
            });
    }, []);

    const handleSearch = () => {
        if (searchQuery) {
            setLoading(true);
            axios
                .get(`https://srirambackend.serveo.net/api/search?query=${searchQuery}`)
                .then((response) => {
                    setPosts(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error performing search:", error);
                    setLoading(false);
                });
        }
    };

    const handleLike = (postId) => {
        axios
            .post(`https://srirambackend.serveo.net/api/posts/like/${postId}`)
            .then((response) => {
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? response.data : post
                );
                setPosts(updatedPosts);
            })
            .catch((error) => console.error("Error liking post:", error));
    };

    const handleAddComment = (postId, commentText) => {
        if (user) {
            axios
                .post(`https://srirambackend.serveo.net/api/posts/comment/${postId}`, {
                    text: commentText,
                    email: user.email, // Use the logged-in user's email
                })
                .then((response) => {
                    const updatedPosts = posts.map((post) =>
                        post._id === postId ? response.data : post
                    );
                    setPosts(updatedPosts);
                })
                .catch((error) => console.error("Error adding comment:", error));
        } else {
            console.log("User not authenticated.");
        }
    };

    const handleDownload = (fileName) => {
        const link = document.createElement("a");
        link.href = `https://srirambackend.serveo.net/uploads/${fileName}`;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="home">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                    onClick={() => {
                        setSearchQuery(searchInput);
                        handleSearch();
                    }}
                >
                    Search
                </button>
            </div>

            {loading ? (
                <div className="loading">
                    <img src="https://cdn.dribbble.com/users/1063378/screenshots/7969170/___1.gif" alt="loading" />
                </div>
            ) : (
                <>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} className="post">
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>

                                {post.file && (
                                    <div>
                                        {post.file.includes(".mp4") ? (
                                            <video width="320" height="240" controls>
                                                <source
                                                    src={`https://srirambackend.serveo.net/uploads/${post.file}`}
                                                    type="video/mp4"
                                                />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : post.file.includes(".pdf") ? (
                                            <embed
                                                src={`https://srirambackend.serveo.net/uploads/${post.file}`}
                                                type="application/pdf"
                                                width="600"
                                                height="500"
                                            />
                                        ) : (
                                            <img
                                                src={`https://srirambackend.serveo.net/uploads/${post.file}`}
                                                alt="Post Media"
                                            />
                                        )}
                                        <button onClick={() => handleDownload(post.file)}>
                                            Download
                                        </button>
                                    </div>
                                )}

                                <p>
                                    Posted:{" "}
                                    {post.createdAt
                                        ? formatDistanceToNow(new Date(post.createdAt), {
                                              addSuffix: true,
                                          })
                                        : "Unknown"}
                                </p>
                                <p>Likes: {post.likes}</p>
                                <button onClick={() => handleLike(post._id)}>Like</button>
                                <p>Comments: {post.comments.length}</p>
                                <ul>
                                    {post.comments.map((comment, index) => (
                                        <li key={index}>
                                            <strong>{comment.email || "Unknown User"}: </strong>
                                            {comment.text}
                                        </li>
                                    ))}
                                </ul>

                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    className="comment-input"
                                    onChange={(e) => setCommentInput(e.target.value)}
                                />
                                <button
                                    onClick={() => handleAddComment(post._id, commentInput)}
                                    className="comment-button"
                                >
                                    Add Comment
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No posts found</p>
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
