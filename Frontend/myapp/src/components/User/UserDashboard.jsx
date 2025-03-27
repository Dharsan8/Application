import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";  // ✅ Import useNavigate
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import Navbar from "./NavBar";

const UserDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filteredRestaurants, setFilteredRestaurants] = useState(foodItems);
    const { username } = useParams();
    
    const navigate = useNavigate();

 
    useEffect(() => {
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:3000/api/restaurants"); // ✅ Updated URL
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                const data = await response.json();
                setFoodItems(data);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setError("Error fetching restaurants. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredRestaurants(foodItems); // Show all when empty
            return;
        }

        const filteredData = foodItems.filter(
            (restaurant) =>
                restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredRestaurants(filteredData);
    }, [searchQuery, foodItems]);

const handleRestaurantClick = (restaurant) => {
    const id = restaurant.restaurantId || restaurant.restaurantID

    navigate(`/user/${username}/${restaurant.restaurantName}`, {
        state: { restaurantId: id },
    });
};


    return (
        <div className="bg-gray-100 min-h-screen text-gray-800">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />  {/* Use Navbar Component */}

             {/* Restaurant Listing */}
             <div className="pt-[80px] p-3">
                {loading ? (
                    <p className="text-gray-700 text-center">Loading restaurants...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {filteredRestaurants.length > 0 ? (
                            filteredRestaurants.map((restaurant) => (
                                <motion.div
                                    key={restaurant._id}
                                    onClick={()  => handleRestaurantClick(restaurant)}
                                    className="relative cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.03] w-[210px] h-[170px] mx-auto"
                                >
                                    {/* Small Image */}
                                    <img
                                        src={`http://localhost:3000${restaurant.restaurantImage}`}
                                        alt={restaurant.restaurantName}
                                        className="w-full h-[140px] object-cover"
                                    />
                                    {/* Restaurant Name (Bottom Left of Image) */}
                                    <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-1 text-white text-xs font-medium rounded">
                                        {restaurant.restaurantName}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-700 text-center col-span-3">No matching restaurants found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
