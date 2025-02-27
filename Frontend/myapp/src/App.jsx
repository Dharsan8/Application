import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import RestaurantSignup from "./components/RestaurantSignup";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard"; // ✅ Import Admin Dashboard

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant-signup" element={<RestaurantSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;
