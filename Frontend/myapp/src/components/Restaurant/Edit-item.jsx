import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditItem() {
  const { itemId } = useParams();
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
    restaurantId: "",
  });

  const [image, setImage] = useState(null);

  // Fetch Item Details
 
  useEffect(() => {
    axios.get(`http://localhost:3000/api/food/${itemId}`)
      .then((response) => {
        const itemData = response.data;
  
        if (!itemData.restaurantId) {
          const storedData = localStorage.getItem("restaurantData");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            itemData.restaurantId = parsedData.restaurantID || "";
          }
        }
  
        setFoodData(itemData);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      });
  }, [itemId]);
  
    

  // Handle Input Change
  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key] || ""); // Ensure no undefined values
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:3000/api/food/update/${itemId}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      

      alert("Food item updated successfully!");
      navigate("/restaurant-dashboard");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Edit Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.name || ""}
        />

        <select
          name="category"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.category || "Starter"}
        >
          <option value="Starter">Starter</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price (₹)"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.price || ""}
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.description || ""}
        />

        <select
          name="availability"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.availability || "Available"}
        >
          <option value="Available">Available</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select
          name="vegNonVeg"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.vegNonVeg || "Veg"}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <input
          type="text"
          name="customization"
          placeholder="Customization (Optional)"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.customization || ""}
        />

        <input
          type="text"
          name="prepTime"
          placeholder="Estimated Preparation Time (mins)"
          required
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={foodData.prepTime || ""}
        />

        <input type="file" accept="image/*" className="w-full p-2 border rounded bg-white" onChange={handleFileChange} />
        <input
  type="text"
  name="restaurantId"
  value={foodData.restaurantId || ""}
  placeholder="Restaurant ID"
  className="w-full p-2 border rounded"
  readOnly
/>




        {foodData.image && (
          <img src={foodData.image} alt="Current Dish" className="w-32 h-32 object-cover rounded mt-2" />
        )}

        <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg w-full transition-all">
          Update Dish
        </button>
      </form>
    </div>
  );
}
