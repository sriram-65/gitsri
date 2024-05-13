import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [commentInput, setCommentInput] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/posts")
            .then((response) => setPosts(response.data))
            .catch((error) => console.error("Error fetching posts:", error));
    }, []);

    const handleLike = (postId) => {
        
        

        axios.post(`http://localhost:5000/api/posts/like/${postId}`)
            .then((response) => {
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? response.data : post
                );
                setPosts(updatedPosts);
                localStorage.setItem(`liked_${postId}`, true);
            })
            .catch((error) => console.error("Error liking post:", error));
    };

    const handleAddComment = (postId, commentText) => {
        

            if(commentInput==""){
                alert("Enter Your Comment")
            }
            else{
                axios.post(`http://localhost:5000/api/posts/comment/${postId}`, {
                text: commentText,
            })
            .then((response) => {
                const updatedPosts = posts.map((post) =>
                    post._id === postId ? response.data : post
                );
                setPosts(updatedPosts);
                setCommentInput(""); // Clear the comment input after adding
            })
            .catch((error) => console.error("Error adding comment:", error));
            }
    };

    function refresh(){
        window.location.reload()
    }

    return (
        <div className="home">
            <button onClick={refresh}>Refresh</button>
            <h1>Recent Posts</h1>
            {posts.length === 0 ?
                <h1>No Post ..... </h1>
                :
                posts.map((post) => (
                    <div key={post._id} className="post">
                        <div>
                            
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        {post.file && (
                            <div>
                                {post.file.includes(".mp4") ? (
                                    <video width="720" height="540" controls>
                                        <source
                                            src={`http://localhost:5000/uploads/${post.file}`}
                                            type="video/mp4"
                                        />
                                    </video>
                                ) : (
                                    <img
                                        src={`http://localhost:5000/uploads/${post.file}`}
                                        width={590}
                                    />
                                )}
                                {post.file.includes(".pdf")? <object data={`http://localhost:5000/uploads/${post.file}`} width={400} height={500} ></object>: null}
                                
                                
                            </div>
                        )}
                        <p>Likes: {post.likes}</p>
                        <button onClick={() => handleLike(post._id)}>Like</button>
                        <p>Comments: {post.comments.length}</p>
                        <ul>
                            {post.comments.map((comment) => (
                                <li key={comment._id}>{comment.text}</li>
                            ))}
                        </ul>

                        <input
                            type="text"
                            placeholder="Add a comment"
                            className="comment-input"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                        <button
                            onClick={() => handleAddComment(post._id, commentInput)}
                            className="comment-button"
                        >
                            Add Comment
                        </button>
                    </div>
                ))}
      
        </div>

                 

    );
}

export default Home;
