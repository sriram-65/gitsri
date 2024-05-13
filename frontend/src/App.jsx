// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import './App.css';
import Home from './Home';
import CreatePost from './assets/CreatePost';

function App() {
	return (
		<Router>
			<div className="app">
				<nav>
					<div className="logo">
						<Link to="/" style={{textDecoration:"none" , color:"black"}}><h2>CreateWorld</h2></Link>
					</div>
					<div className="links">
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/create">Create </Link>
						</li>
					</ul>
					</div>
					
				</nav>
				<Routes>
					<Route path="/create" element={<CreatePost/>} />
					<Route path="/" element={<Home/>} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
