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
import UserDashboard from "./components/User/UserDashboard";
import ItemPage from "./components/User/ItemPage";
import FoodItem from "./components/User/FoodItem";
import Orders from "./components/Restaurant/Orders";
import DeliveryRegister from "./components/Delivery/DeliveryRegister";
import DeliveryLogin from "./components/Delivery/DeliveryLogin";
import DeliveryDashboard from "./components/Delivery/DeliveryDashboard";
import OrderHistory from "./components/User/OrderHistory";
import FeedbackForm from "./components/User/FeedbackForm";
import DeliveryAuthPage from "./components/Delivery/DeliveryAuthPage";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/restaurantreg" element={<RestaurantRegister/>}/>
        <Route path="/restaurant-login" element={<RestaurantLogin/>}/>
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard/>}/>
        <Route path="/add-item" element={<AddItem/>}/>
        {/* <Route path="/add-item/:restaurantId" element={<EditItem />} /> */}
        <Route path="/edit-item/:itemId" element={<EditItem />} />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ New Route */}
        <Route path="/user/:username" element={<UserDashboard />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
        <Route path="/restaurant/items" element={<ItemPage />} />
        <Route path ="/user/:username/:restaurantname" element={<FoodItem/>} />
        <Route path="/restaurant-dashboard/orders" element={<Orders />} />
        <Route path="/order-history/:username" element={<OrderHistory />} />
<Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
<Route path="/feedback/:orderId" element={<FeedbackForm />} />
<Route path="/delivery-auth" element={<DeliveryAuthPage/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App;
