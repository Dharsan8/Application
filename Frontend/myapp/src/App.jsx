import React from "react";
import "./App.css"; // Import external CSS
import LandingPage from "./LandingPage/LandingPage";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"; 
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
