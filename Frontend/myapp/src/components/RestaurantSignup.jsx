import React, { useState } from "react";
import axios from "axios";

const RestaurantSignup = () => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    email: "",
    password: "", // Add password field
    phone: "",
    address: "",
    cuisine: "", // Add cuisine field
  });

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/restaurants", restaurant);
      alert("Restaurant registered successfully!");
      setRestaurant({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        cuisine: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Error registering restaurant.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Register Your Restaurant
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={restaurant.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={restaurant.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={restaurant.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Cuisine Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300">
              Cuisine Type
            </label>
            <input
              type="text"
              name="cuisine"
              value={restaurant.cuisine}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSignup;
