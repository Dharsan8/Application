import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/images/heroback.jpg";

export default function RestaurantLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantID: "", // 🔹 Changed from email to restaurantID
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { restaurantID, password } = formData; // 🔹 Updated variable

    if (!restaurantID || !password) {
      alert("Please enter both Restaurant ID and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/restaurants/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantID, password }), // 🔹 Sending correct field
      });

      if (!response.ok) {
        throw new Error(`Login failed! Status: ${response.status}`);
      }

      const data = await response.json();
      alert("Login Successful! Redirecting...");
      navigate("/restaurant-dashboard"); // 🔹 Navigate to restaurant dashboard after login

    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid Restaurant ID or Password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex flex-col items-center p-6">
      {/* Hero Section */}
      <div className="relative w-full h-56 flex flex-col justify-center items-center text-center text-white bg-[#8A4F7D] rounded-lg shadow-lg overflow-hidden">
        <img src={heroImage} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 max-w-3xl p-6">
          <h1 className="text-5xl font-extrabold">Welcome Back!</h1>
          <p className="text-lg mt-2">Login to manage your restaurant and serve your customers better.</p>
        </div>
      </div>

      {/* Login Form */}
      <h2 className="text-4xl font-bold text-[#8A4F7D] text-center mt-16">Restaurant Login</h2>
      <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">
        Enter your credentials to access your restaurant dashboard.
      </p>

      <div className="bg-white text-gray-900 p-6 mt-10 rounded-xl shadow-2xl w-full max-w-lg transition-all duration-500 border border-gray-300 flex flex-col">
        <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Login Details</h3>
        <input
          className="w-full p-3 my-2 rounded border border-gray-300"
          name="restaurantID" // 🔹 Changed name from email to restaurantID
          type="text"
          placeholder="Restaurant ID"
          value={formData.restaurantID}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-3 my-2 rounded border border-gray-300"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          onClick={handleLogin}
          className="w-full bg-[#8A4F7D] hover:bg-[#6A3B5B] text-white p-3 rounded-lg font-bold transition-all mt-4"
        >
          Login
        </button>

        {/* Not Registered? Sign Up Link */}
        <p className="text-center text-gray-700 mt-4">
          Not registered?{" "}
          <Link to="/restaurantreg" className="text-[#F76B1C] font-semibold hover:underline">
            Click here to sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
