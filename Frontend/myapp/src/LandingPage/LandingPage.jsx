import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function LandingPage() {
  const [searchCity, setSearchCity] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Backend API URL
  const API_URL = "http://localhost:5000/restaurants";
  const backendUrl = "http://localhost:5000"; // Base URL for images - node restaurantadmin

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter restaurants based on the entered city (supports partial matches)
  const handleSearch = () => {
    const filtered = restaurants.filter((restaurant) =>
      restaurant.city.toLowerCase().includes(searchCity.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Foods</h1>
        <div>
          <button className="px-4 py-2 mr-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Link to = "/login">Login </Link>
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Background Section */}
      <div
        className="relative w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('/image/Foodimage.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <h1 className="text-white text-4xl font-bold text-center">
            Discover the best food & drinks in Your City
          </h1>

          {/* Search Bar */}
          <div className="mt-6 flex bg-white rounded-full overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Enter City"
              className="px-4 py-2 w-72 outline-none text-gray-700"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-6 py-2 font-semibold hover:bg-green-600"
              onClick={handleSearch}
            >
              Find the Restaurant
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600 mt-4">Loading restaurants...</p>}

      {/* Restaurant Results */}
      <div className="container mx-auto px-4 py-10">
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white p-4 rounded-lg shadow-lg"
              >
                {/* Restaurant Image */}
                <img
                  src={`${backendUrl}${restaurant.image}`} // Ensure correct image path
                  alt={restaurant.name}
                  className="w-full h-40 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "/image/placeholder.jpg")} // Fallback image
                />
                <h2 className="text-xl font-semibold mt-2">{restaurant.name}</h2>
                <p className="text-gray-600">{restaurant.address}</p>
                <p className="text-gray-700 font-semibold">{restaurant.cuisine}</p>
                <p className="text-yellow-500">⭐ {restaurant.rating}</p>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-500 text-center mt-6">No restaurants found in this area.</p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
