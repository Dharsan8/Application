import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState({
    name: "",
    category: "Starter",
    price: "",
    description: "",
    availability: "Available",
    vegNonVeg: "Veg",
    customization: "",
    prepTime: "",
    restaurantId: "", // Will be set from localStorage
  });

  const [image, setImage] = useState(null);

  // Fetch Restaurant ID from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("restaurantData");

    if (!storedData) {
      console.log("Restaurant ID not found! Please log in again.");
    } else {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Retrieved Data:", parsedData);
        
        if (parsedData.restaurantID) {
          setFoodData((prev) => ({ ...prev, restaurantId: parsedData.restaurantID }));
        } else {
          console.log("Restaurant ID not found in object!");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!foodData.restaurantId) {
      alert("Restaurant ID not found! Please log in again.");
      return;
    }

    console.log("Submitting Food Data:", foodData); // Debugging log

    // Create FormData object for text + image data
    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:3000/api/food/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
          restaurantId: foodData.restaurantId, // Keep the restaurantId
        });
        setImage(null);
        navigate("/restaurant-dashboard"); // Redirect after success
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
    <input type="text" name="name" placeholder="Dish Name" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.name} />

    <select name="category" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.category}>
      <option value="Starter">Starter</option>
      <option value="Main Course">Main Course</option>
      <option value="Desserts">Desserts</option>
      <option value="Beverages">Beverages</option>
    </select>

    <input type="number" name="price" placeholder="Price (₹)" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.price} />

    <textarea name="description" placeholder="Description" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.description} />

    <select name="availability" className="w-full p-2 border rounded" onChange={handleChange} value={foodData.availability}>
      <option value="Available">Available</option>
      <option value="Out of Stock">Out of Stock</option>
    </select>

    <select name="vegNonVeg" className="w-full p-2 border rounded" onChange={handleChange} value={foodData.vegNonVeg}>
      <option value="Veg">Veg</option>
      <option value="Non-Veg">Non-Veg</option>
    </select>

    <input type="text" name="customization" placeholder="Customization (Optional)" className="w-full p-2 border rounded" onChange={handleChange} value={foodData.customization} />

    <input type="text" name="prepTime" placeholder="Estimated Preparation Time (mins)" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.prepTime} />

    <input type="file" accept="image/*" required className="w-full p-2 border rounded bg-white" onChange={handleFileChange} />

    {/* Restaurant ID (Can be set dynamically or from context) */}
    <input type="text" name="restaurantId" placeholder="Restaurant ID" required className="w-full p-2 border rounded" onChange={handleChange} value={foodData.restaurantId} />

    <button type="submit" className="bg-purple-700 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-lg w-full transition-all">
      Add Dish
    </button>
  </form>
</div>

  );
}
