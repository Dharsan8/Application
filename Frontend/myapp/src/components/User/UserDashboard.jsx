import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import Navbar from "./NavBar";

const UserDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();

 

    const handleRestaurantClick = (restaurant) => {
        console.log("Restaurant Data:", restaurant); // Debugging
        if (!restaurant.location || !restaurant.restaurantName) {
            console.error("Missing restaurant location or name", restaurant);
            return;
        }
        navigate(`/restaurant/items?location=${encodeURIComponent(restaurant.location)}&restaurantName=${encodeURIComponent(restaurant.restaurantName)}`);
    };
    
 
    
    
    

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError("Please enter a search query.");
            setFoodItems([]); 
            return;
        }

        setLoading(true);
        setError("");
        setFoodItems([]);

        try {
            const response = await fetch(`http://localhost:3000/search?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }
            const data = await response.json();
            setFoodItems(data);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setError("Error fetching search results. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            <Navbar />  {/* Use Navbar Component */}

            {/* Search Bar */}
            <div className="flex flex-col items-center mt-10 p-4">
                <h1 className="text-3xl font-bold mb-4">Find Delicious Food</h1>

                <div className="flex w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Search by location or restaurant name..."
                        className="p-3 border rounded-l-lg text-gray-800 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="bg-[#E68057] text-white px-6 py-3 rounded-r-lg font-semibold flex items-center space-x-2 hover:bg-[#c95e3e] transition"
                        onClick={handleSearch}
                    >
                        <FaSearch />
                        <span>Search</span>
                    </button>
                </div>

                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            {/* Display Search Results */}
            <div className="mt-10 px-6">
                {loading ? (
                    <p className="text-center text-gray-600 text-lg">Loading...</p>
                ) : foodItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {foodItems.map((restaurant) => (
                          <motion.div
                          key={restaurant._id}
                          onClick={() => handleRestaurantClick(restaurant)}   // ✅ Fixed function call
                              className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                          >
                              <div className="absolute top-2 left-2 bg-[#E68057] text-white px-3 py-1 text-sm rounded-full shadow-md">
                                  {restaurant.restaurantName}
                              </div>
                              <img
                                  src={`http://localhost:3000${restaurant.restaurantImage}`}
                                  alt={restaurant.restaurantName}
                                  className="w-full h-56 object-cover rounded-lg"
                              />
                          </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No restaurants found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
