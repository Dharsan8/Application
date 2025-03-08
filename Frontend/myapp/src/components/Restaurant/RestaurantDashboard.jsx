import React, { useState, useEffect } from "react";
import { FaUserCircle, FaPlus, FaEdit, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-[#8A4F7D] text-white w-64 p-5 space-y-6 transition-all ${sidebarOpen ? "w-64" : "w-16"}`}>
        <div className="flex justify-between items-center">
          <h1 className={`text-xl font-bold ${!sidebarOpen && "hidden"}`}>Dashboard</h1>
          <FaBars className="text-white text-2xl cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <nav className="mt-10">
          <button
            className="flex items-center space-x-3 w-full py-3 px-4 rounded-md hover:bg-[#6B3A63] transition"
            onClick={() => navigate("/add-item")}
          >
            <FaPlus />
            {sidebarOpen && <span>Create New Item</span>}
          </button>

          <button
            className="flex items-center space-x-3 w-full py-3 px-4 rounded-md hover:bg-[#6B3A63] transition"
            onClick={() => navigate("/edit-item")}
          >
            <FaEdit />
            {sidebarOpen && <span>Edit Item</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
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

        {/* Content */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {restaurant?.restaurantName}!</h2>
          <p className="text-gray-600 mt-2">Manage your restaurant.</p>
        </div>
      </div>
    </div>
  );
}
