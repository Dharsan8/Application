import React from "react";
import "./App.css"; // Import external CSS

function App() {
  return (
    <div className="main-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">Zomato</h1>
        <div className="nav-items">
          <span>Search</span>
          <span>📍 Coimbatore</span>
          <button className="nav-btn">Login</button>
          <button className="nav-btn">Signup</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-text">Discover the best food & drinks in Your City</h1>
        <div className="search-bar">
          <input type="text" placeholder="Enter your location" />
          <button className="search-btn">Find the Restaurant</button>
        </div>
      </div>
    </div>
  );
}

export default App;
