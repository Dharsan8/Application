import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBox, FaUserCircle, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const UserDashboard = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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
            {/* Navigation Bar */}
            <nav className="bg-[#8A4F7D] text-white p-4 flex justify-between items-center shadow-md">
                <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg font-bold tracking-wide italic drop-shadow-md"
                >
                    Foodie
                </motion.h1>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <FaUserCircle className="text-2xl" />
                        <span>{username}</span>
                    </div>

                    <Link to="/cart" className="flex items-center space-x-2">
                        <FaShoppingCart className="text-xl" />
                        <span>Cart</span>
                    </Link>

                    <Link to="/order-history" className="flex items-center space-x-2">
                        <FaBox className="text-xl" />
                        <span>My Orders</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

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
                                className="relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
                            >
                                {/* Restaurant Name Badge */}
                                <div className="absolute top-2 left-2 bg-[#E68057] text-white px-3 py-1 text-sm rounded-full shadow-md">
                                    {restaurant.restaurantName}
                                </div>

                                {/* Restaurant Image */}
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
