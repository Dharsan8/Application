import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const [foodData, setFoodData] = useState({
    name: "",
    quantity: "",
    offer: "",
    price: "",
    cuisineType: "South Indian",
    hotelName: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    Object.keys(foodData).forEach((key) => {
      formData.append(key, foodData[key]);
    });
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("http://localhost:3000/api/food/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Food Item Added Successfully!");
      navigate("/restaurant-dashboard");
    } catch (error) {
      alert("Error Adding Food Item: " + error.response?.data?.error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-[#F8F8F8] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#8A4F7D] mb-4">Add New Food Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input 
          type="text" name="name" placeholder="Food Name" required 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.name} 
        />

        <input 
          type="number" name="quantity" placeholder="Quantity" required 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.quantity} 
        />

        <input 
          type="text" name="offer" placeholder="Offer/Discount (Optional)" 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.offer} 
        />

        <input 
          type="number" name="price" placeholder="Price in ₹" required 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.price} 
        />

        <select name="cuisineType" required className="w-full p-2 border border-gray-300 rounded" onChange={handleChange} value={foodData.cuisineType}>
          <option value="South Indian">South Indian</option>
          <option value="North Indian">North Indian</option>
        </select>

        <input 
          type="text" name="hotelName" placeholder="Hotel Name" required 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.hotelName} 
        />

        <input 
          type="text" name="location" placeholder="Location" required 
          className="w-full p-2 border border-gray-300 rounded" 
          onChange={handleChange} value={foodData.location} 
        />

        {/* File Upload for Image */}
        <input 
          type="file" accept="image/*" required 
          className="w-full p-2 border border-gray-300 rounded bg-white"
          onChange={handleFileChange} 
        />

        <button type="submit" className="bg-[#8A4F7D] hover:bg-[#6F3D63] text-white font-semibold px-6 py-2 rounded-lg w-full transition-all">
          Add Food Item
        </button>
      </form>
    </div>
  );
}
