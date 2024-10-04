import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function CreatePost() {
    const navigate = useNavigate();
    const [newPost, setNewPost] = useState({
        title: "",
        content: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPost({ ...newPost, [name]: value });
    };

    const handleFileChange = (event) => {
        setNewPost({ ...newPost, file: event.target.files[0] });
    };

    const handlePostSubmit = () => {
        if (!newPost.title || !newPost.content) {
            alert("Please fill out all fields to upload a post.");
        } else {
            const formData = new FormData();
            formData.append("title", newPost.title);
            formData.append("content", newPost.content);
            formData.append("file", newPost.file);

            setLoading(true); 
            axios.post("https://srirambackend.serveo.net/api/posts", formData)
                .then((response) => {
                    setNewPost({ title: "", content: "", file: null });
                    setLoading(false); 
                    navigate("/"); 
                })
                .catch((error) => {
                    console.error("Error creating post:", error);
                    setLoading(false); 
                });
        }
    };

    return (
        <div className="create-post">
            <h2 style={{ marginTop: "40px" }}>Create a Post</h2>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={newPost.title}
                required
                onChange={handleInputChange}
            />
            <textarea
                rows={10}
                cols={40}
                name="content"
                placeholder="Content"
                value={newPost.content}
                required
                onChange={handleInputChange}
            ></textarea>
            <input type="file" name="file" onChange={handleFileChange} />
            <button onClick={handlePostSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Publish the Post"}
            </button>

            {loading && (
                <div className="loading-overlay">
                   <img src="https://cdn.dribbble.com/users/1549398/screenshots/6665581/loading.gif" alt="Loading..." />
                </div>
            )}
        </div>
    );
}

export default CreatePost;