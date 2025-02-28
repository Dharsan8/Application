import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard"; // ✅ Import Admin Dashboard
import RestaurantRegister from "./components/RestaurantRegister";
import RestaurantLogin from "./components/RestaurantLoginId";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurantreg" element={<RestaurantRegister/>}/>
        <Route path="/restaurant-login" element={<RestaurantLogin/>}/>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;