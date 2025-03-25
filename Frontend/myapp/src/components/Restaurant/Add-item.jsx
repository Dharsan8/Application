import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItem({ onFoodItemAdded }) {
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState({
    name: "",
    category: "Starter",
    price: "",
    description: "",
    availability: "Available", // ✅ Default value
    vegNonVeg: "Veg", // ✅ Required
    customization: "",
    prepTime: "",
    restaurantId: "",
    location: "",
    restaurantName: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("restaurantData");

    if (!storedData) {
      console.log("Restaurant data not found! Please log in again.");
    } else {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.restaurantID && parsedData.location && parsedData.restaurantName) {
          setFoodData((prev) => ({
            ...prev,
            restaurantId: parsedData.restaurantID,
            location: parsedData.location,
            restaurantName: parsedData.restaurantName
          }));
        } else {
          console.log("Required fields missing in stored object!");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodData.restaurantId) {
      alert("Restaurant ID not found! Please log in again.");
      return;
    }

    console.log("Submitting Food Data:", foodData);

    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/food/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        alert("Food item added successfully!");
        setFoodData({
          name: "",
          category: "Starter",
          price: "",
          description: "",
          availability: "Available",
          vegNonVeg: "Veg",
          customization: "",
          prepTime: "",
          restaurantId: foodData.restaurantId,
          location: foodData.location,
          restaurantName: foodData.restaurantName
        });
        setImage(null);
        if (onFoodItemAdded) {
          onFoodItemAdded();
        }
        navigate("/restaurant-dashboard");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Add New Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Dish Name */}
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.name}
        />

        {/* Restaurant Name (Read-Only) */}
        <input
          type="text"
          name="restaurantName"
          placeholder="Restaurant Name"
          className="w-full p-2 border rounded"
          value={foodData.restaurantName}
          readOnly
        />

        {/* Location (Read-Only) */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded"
          value={foodData.location}
          readOnly
        />

        {/* Category Dropdown */}
        <select
          name="category"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.category}
        >
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.price}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.description}
        />

        {/* Availability Dropdown ✅ */}
        <select
          name="availability"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.availability}
        >
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        {/* Veg/Non-Veg Dropdown ✅ */}
        <select
          name="vegNonVeg"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.vegNonVeg}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        {/* Customization (Optional) ✅ */}
        <input
          type="text"
          name="customization"
          placeholder="Customization (Optional)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.customization}
        />

        {/* Preparation Time ✅ */}
        <input
          type="text"
          name="prepTime"
          placeholder="Preparation Time (e.g. 15 mins)"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.prepTime}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          required
          className="w-full p-2 border rounded bg-white"
          onChange={handleFileChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg w-full transition-all"
        >
          Add Dish
        </button>
      </form>
    </div>
  );
}
