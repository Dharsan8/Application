import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const FoodItem = () => {
    const location = useLocation();
    const { restaurantId } = location.state;
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!restaurantId) {
            console.error("Restaurant ID is undefined");
            return;
        }
    
        const fetchFoodItems = async () => {
            setLoading(true);
            try {
                console.log("Restaurant ID in frontend:", restaurantId);
                const response = await fetch(`http://localhost:3000/api/food/${restaurantId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch food items");
                }
                const data = await response.json();
                setFoodItems(data);
            } catch (error) {
                console.error("Error fetching food items:", error);
                setError("Error fetching food items. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchFoodItems();
    }, [restaurantId]);
    


    return (
<div className="min-h-screen bg-gray-100 p-4">
            {loading ? (
                <p className="text-gray-700 text-center">Loading food items...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {foodItems.map((food) => (
                        <div key={food._id} className="bg-white rounded-lg shadow-md p-3">
                            <img src={`http://localhost:3000${food.image}`} alt={food.name} className="w-full h-32 object-cover rounded-md" />
                            <h2 className="text-lg font-semibold mt-2">{food.name}</h2>
                            <p className="text-gray-600">${food.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FoodItem;
