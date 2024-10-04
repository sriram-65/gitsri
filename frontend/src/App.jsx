import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import CreatePost from './assets/CreatePost';
import { signInWithGoogle, signOutUser, auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app">
        <nav>
          <div className="logo">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <h1>12th Sriram Toppers</h1>
            </Link>
          </div>
          <div className="links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {/* Conditionally display the "Create" link if the user is logged in */}
              {user && (
                <li>
                  <Link to="/create">Create</Link>
                </li>
              )}
            </ul>
            {/* Show login or logout button based on authentication status */}
            {user ? (
              <>
                <button onClick={signOutUser}>Logout</button>
                <p>Welcome, {user.displayName}</p>
              </>
            ) : (
              <button onClick={signInWithGoogle}>Login with Google</button>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/create" element={user ? <CreatePost /> : <Home />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
