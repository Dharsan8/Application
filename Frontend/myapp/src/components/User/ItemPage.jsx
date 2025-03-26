import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./NavBar";

const ItemPage = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract query parameters from the URL
  const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const extractedLocation = searchParams.get("location");
    const restaurantName = searchParams.get("restaurantName");

    console.log("Extracted Query Params:", extractedLocation, restaurantName);
    useEffect(() => {
        if (extractedLocation && restaurantName) {
            fetch(`http://localhost:3000/api/foodItems?location=${extractedLocation}&restaurantName=${restaurantName}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then((data) => console.log("Fetched data:", data))
                .catch((err) => console.error("Error fetching food items:", err));
        } else {
            console.error("Missing query parameters!");
        }
    }, [extractedLocation, restaurantName]);
    
  return (
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center">Available Food Items</h1>

        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#E68057]"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center mt-4">{error}</p>
        ) : foodItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {foodItems.map((item) => (
              <div key={item._id} className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-xl font-bold mt-3">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-lg font-bold text-[#E68057] mt-2">₹{item.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-6">No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
