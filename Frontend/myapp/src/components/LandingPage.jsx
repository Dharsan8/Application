import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#E9C46A] text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1200px] bg-white/70 backdrop-blur-md shadow-lg border-b border-gray-300 px-6 py-3 flex justify-between items-center text-white z-50 rounded-[12px]">
      <motion.h1
  initial={{ opacity: 0, x: -10 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
  className="text-lg font-bold text-orange-600 tracking-wide italic drop-shadow-md"
>
  Foodie
</motion.h1>

        <div className="flex space-x-3">
          <Link
            to="/restaurantreg"
            className="px-4 py-2 rounded-[11px] bg-[#E76F51] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
          >
            Restaurant
          </Link>
          {/* <Link
            to="/admin-login"
            className="px-3 py-2 rounded-[11px] bg-[#264653] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
          >
            Admin
          </Link> */}
          <Link
            to="/login"
            className="px-4 py-2 rounded-[11px] bg-[#2A9D8F] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-3 py-1 rounded-[11px] bg-[#FAD961] text-gray-900 text-sm font-medium shadow-sm hover:scale-105 hover:bg-[#e3c251] transition-all"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section (Image Full Screen) */}
      <div
        className="w-full min-h-screen flex flex-col items-center justify-center relative text-white"
        style={{
          backgroundImage: "url('/image/background.png')",
          backgroundSize: "cover", // Full screen cover
          backgroundPosition: "center",
          //marginTop: "10px", // Adjust for navbar height (approx.)
        }}
      >
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center max-w-4xl px-8"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg ">
            Savor Every Moment, One Dish at a Time.
          </h1>
          <p className="text-xl md:text-xl font-extrabold drop-shadow-lg ">
            Satisfy your cravings with exceptional cuisine from the finest local
            spots.
          </p>

          {/* Additional Content */}
          <div className="mt-8 flex flex-wrap  gap-4 justify-center">
            <div className="px-6 py-3 bg-[#E9C46A]/80 text-gray-900 font-semibold rounded-lg shadow-md">
              Best Restaurant
            </div>
            <div className="px-6 py-3 bg-[#2A9D8F]/80 text-white font-semibold rounded-lg shadow-md">
              Cheap Rate
            </div>
            <div className="px-6 py-3 bg-[#264653]/80 text-white font-semibold rounded-lg shadow-md">
              Delivery Fast
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;


