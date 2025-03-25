import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    FaShoppingCart,
    FaBox,
    FaUserCircle,
    FaSignOutAlt,
    FaSearch,
    FaPlus
} from "react-icons/fa";
import { motion } from "framer-motion";

const UserDashboard = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:3000/search?query=${searchQuery}`);
            if (!response.ok) {
                throw new Error("Failed to fetch food items");
            }
            const data = await response.json();
    
            // Filter only available items
            const availableItems = data.filter(item => item.availability.toLowerCase() === "available");
    
            setFoodItems(availableItems);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };
    const handleAddToCart = (item) => {
        alert(`Added ${item.name} to cart!`);
        // You can implement logic to add this item to the cart in the backend
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
            </div>

            {/* Display Search Results */}
            <div className="mt-10 px-6">
                {foodItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {foodItems.map((item) => (
                            <motion.div
                                key={item._id}
                                className="bg-white rounded-xl shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Food Image */}
                                <div className="relative">
                                    <img
                                        src={`http://localhost:3000${item.image}`}
                                        alt={item.name}
                                        className="w-full h-56 object-cover rounded-md"
                                    />
                                    <span
                                        className={`absolute top-2 right-2 px-3 py-1 rounded-md text-white font-semibold text-xs ${
                                            item.vegNonVeg === "Veg" ? "bg-green-600" : "bg-red-600"
                                        }`}
                                    >
                                        {item.vegNonVeg}
                                    </span>
                                </div>

                                {/* Food Details */}
                                <div className="mt-3">
                                    <h2 className="text-xl font-bold">{item.name}</h2>
                                    <p className="text-gray-600 mt-1">{item.description}</p>
                                    <p className="text-green-600 font-semibold text-lg mt-1">
                                        ₹{item.price}
                                    </p>

                                    {/* Availability */}
                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm text-white ${
                                            item.availability === "Available" ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                    >
                                        {item.availability}
                                    </span>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="mt-4 w-full bg-[#E68057] text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#c95e3e] transition"
                                    >
                                        <FaPlus />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No food items found. Try a different search.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
