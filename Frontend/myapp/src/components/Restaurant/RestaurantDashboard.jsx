import React, { useState, useEffect } from "react";
import { FaUserCircle, FaPlus, FaEdit, FaTrash, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRestaurant = localStorage.getItem("restaurantData");
    try {
      if (storedRestaurant) {
        const parsedRestaurant = JSON.parse(storedRestaurant);
        setRestaurant(parsedRestaurant);
        fetchFoodItems(parsedRestaurant.restaurantID); // Fetch items
      } else {
        navigate("/restaurant-login");
      }
    } catch (error) {
      console.error("Error parsing restaurant data:", error);
      navigate("/restaurant-login");
    }
  }, [navigate]);

  // Fetch food items for the restaurant
  const fetchFoodItems = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/food/${restaurantId}`);
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  // Delete food item
  const handleDelete = async (foodId) => {
    try {
      await axios.delete(`http://localhost:3000/api/food/delete/${foodId}`);
      setFoodItems(foodItems.filter((item) => item._id !== foodId));
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("restaurantData");
    navigate("/restaurant-login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-[#8A4F7D] text-white p-5 space-y-6 transition-all ${sidebarOpen ? "w-64" : "w-16"}`}>
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
                  <button onClick={handleLogout} className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-all">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Food Items Section */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Food Items</h2>
          {foodItems.length === 0 ? (
            <p className="text-gray-600 mt-2">No food items added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {foodItems.map((item) => (
                <div key={item._id} className="bg-white shadow-lg rounded-lg p-4">
                  <img src={`http://localhost:3000${item.image}`} alt={item.name} className="w-full h-40 object-cover rounded-md" />
                  <h3 className="text-xl font-bold mt-2">{item.name}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="text-gray-700 font-bold mt-1">₹{item.price}</p>

                  {/* Buttons */}
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
                      onClick={() => navigate(`/add-item/${item._id}`)}
                    >
                      <FaEdit className="inline-block mr-2" /> Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash className="inline-block mr-2" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
