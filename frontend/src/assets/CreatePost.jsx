// CreatePost.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate()
	const [newPost, setNewPost] = useState({
		title: "",
		content: "",
		file: null,
	});

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setNewPost({ ...newPost, [name]: value });
	};

	const handleFileChange = (event) => {
		setNewPost({ ...newPost, file: event.target.files[0] });
	};

	const handlePostSubmit = () => {
		

			if(newPost==""){
				alert("Please Fill Out this Above Box To Upload a Post")
				
			} 
			else{
				const formData = new FormData();
				formData.append("title", newPost.title);
				formData.append("content", newPost.content);
				formData.append("file", newPost.file);
		
				axios.post("http://localhost:5000/api/posts", formData)
					.then((response) => {
						setNewPost({ title: "", content: "", file: null });
					})
					.catch((error) => console.error("Error creating post:", error));
		
					navigate("/")
			}

            
	};

	return (
		<div className="create-post">
			<h2 style={{marginTop:"40px"}}>Create a Post</h2>
			<input
				type="text"
				name="title"
				placeholder="Title"
				value={newPost.title}
				required:true
				onChange={handleInputChange}
			/>
			<textarea
			   rows={30}
			   cols={40}
				name="content"
				placeholder="Content"
				value={newPost.content}
				required:true
				onChange={handleInputChange}
			></textarea>
			<input type="file" name="file" onChange={handleFileChange} />
			<button onClick={handlePostSubmit}> public the Post </button>
		</div>
	);
	
}

export default CreatePost;
