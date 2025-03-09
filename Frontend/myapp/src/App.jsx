import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard"; // ✅ Import Admin Dashboard
import RestaurantRegister from "./components/Restaurant//RestaurantRegister";
import RestaurantLogin from "./components/Restaurant//RestaurantLoginId";
import RestaurantDashboard from "./components/Restaurant//RestaurantDashboard";
import AddItem from "./components/Restaurant/Add-item";
import EditItem from "./components/Restaurant/Edit-item";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurantreg" element={<RestaurantRegister/>}/>
        <Route path="/restaurant-login" element={<RestaurantLogin/>}/>
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard/>}/>
        <Route path="/add-item" element={<AddItem/>}/>
        {/* <Route path="/add-item/:restaurantId" element={<EditItem />} /> */}
        <Route path="/edit-item/:itemId" element={<EditItem />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ New Route */}
      </Routes>
    </Router>
  );
}

export default App;