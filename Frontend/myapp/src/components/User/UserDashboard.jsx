import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaStar, FaMapMarkerAlt } from "react-icons/fa";
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
                const response = await fetch("http://localhost:3000/api/restaurants");
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
            setFilteredRestaurants(foodItems);
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
        const id = restaurant.restaurantId || restaurant.restaurantID;
        navigate(`/user/${username}/${restaurant.restaurantName}`, {
            state: { 
                restaurantId: id,
                restaurantName: restaurant.restaurantName
            },
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Restaurants</h1>
                    <p className="text-gray-600">Find the best dining experiences in your area</p>
                </div>

                {/* Restaurant Listing */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-4 rounded-lg max-w-md mx-auto text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
{filteredRestaurants.length > 0 ? (
  filteredRestaurants.map((restaurant) => {
    const isClosed = restaurant?.isOpen === false;

    return (
      <motion.div
        key={restaurant._id}
        whileHover={!isClosed ? { y: -5 } : {}}
        onClick={() => {
          if (!isClosed) handleRestaurantClick(restaurant);
        }}
        className={`relative bg-gray-100 rounded-xl shadow-sm overflow-hidden transition-shadow ${
          isClosed
            ? "opacity-50 backdrop-blur-sm pointer-events-none"
            : "cursor-pointer hover:shadow-md"
        }`}
      >
        {/* Restaurant Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={`http://localhost:3000${restaurant.restaurantImage}`}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {isClosed && (
  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-10">
    <div className="relative px-6 py-2 rounded-[10px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-xl text-sm font-semibold uppercase tracking-widest animate-bounce">
      🚫  Closed
    </div>
    <p className="text-xs mt-2 text-white/80 italic animate-fade-in">
      Not accepting orders currently
    </p>
  </div>
)}
        </div>

        {/* Restaurant Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 truncate">
            {restaurant.restaurantName}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FaMapMarkerAlt className="mr-1 text-sm" />
            <span className="text-sm">{restaurant.location}</span>
          </div>
        </div>
      </motion.div>
    );
  })
) : (
  <div className="col-span-full text-center py-12">
    <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
    <h3 className="text-xl font-medium text-gray-700">No restaurants found</h3>
    <p className="text-gray-500 mt-1">Try adjusting your search query</p>
  </div>
)}

                    </div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;