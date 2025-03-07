import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRestaurant = localStorage.getItem("restaurantData");
    try {
      if (storedRestaurant) {
        setRestaurant(JSON.parse(storedRestaurant));
      } else {
        navigate("/restaurant-login");
      }
    } catch (error) {
      console.error("Error parsing restaurant data:", error);
      navigate("/restaurant-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("restaurantData");
    navigate("/restaurant-login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-[#8A4F7D] p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white text-2xl font-bold">Restaurant Dashboard</h1>

        {restaurant && (
          <div className="relative">
            <FaUserCircle className="text-white text-3xl cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-bold text-[#8A4F7D]">{restaurant.restaurantName}</h2>
                <p className="text-gray-700"><b>Owner:</b> {restaurant.ownerName}</p>
                <p className="text-gray-700"><b>Location:</b> {restaurant.location}</p>
                <p className="text-gray-700"><b>Email:</b> {restaurant.email}</p>
                <p className="text-gray-700"><b>Phone:</b> {restaurant.phoneNumber}</p>

                <button 
                  onClick={handleLogout} 
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome, {restaurant?.restaurantName}!
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your restaurant.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
            onClick={() => navigate("/add-item")}
          >
            ➕ Add Item
          </button>

          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
            onClick={() => navigate("/edit-item")}
          >
            ✏️ Edit Item
          </button>

          <button 
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
            onClick={() => navigate("/delete-item")}
          >
            🗑️ Delete Item
          </button>
        </div>
      </div>
    </div>
  );
}
