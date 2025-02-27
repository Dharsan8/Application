import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">Foodie</h1>
        <div>
          <Link to="/restaurant-signup" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 mr-2">
            Add Restaurant
          </Link>
          <Link to="/admin-login" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-2">
            Admin
          </Link>
          <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full h-[400px] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/image/Foodimage.jpg')" }}>
        <div className="bg-black bg-opacity-50 p-6 rounded-lg text-center text-white">
          <h1 className="text-4xl font-bold">Discover the Best Restaurants Near You</h1>
          <p className="mt-2">Find your favorite meals and explore top-rated restaurants.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
