import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login"; // Import the Login component

const UserDetails = ({ userData, onClose }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>
      <button onClick={onClose} className="mt-4 bg-gray-200 p-2 rounded">
        Close
      </button>
    </div>
  );
};

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setShowUserDetails(false);
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:3000/api/customer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setShowUserDetails(true);
    } catch (error) {
      console.error("Failed to fetch user details", error);
      alert("Failed to fetch user details.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#E9C46A] text-gray-900">
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
          <button
            className="px-4 py-2 rounded-[11px] bg-[#E76F51] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
            onClick={() => window.location.href = "/restaurantreg"}
          >
            Restaurant
          </button>
          {userData ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchUserDetails}
                className="rounded-full bg-gray-300 w-10 h-10 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-[11px] bg-[#264653] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              // onClick={handleLoginClick}
              className="px-4 py-2 rounded-[11px] bg-[#2A9D8F] text-white text-sm font-medium shadow-sm hover:scale-105 transition-all"
              onClick={() => window.location.href = "/login"}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div
        className="w-full min-h-screen flex flex-col items-center justify-center relative text-white"
        style={{
          backgroundImage: "url('/image/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
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

      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
            </motion.div>
          </motion.div>
        )}
        {showUserDetails && userData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <UserDetails userData={userData} onClose={() => setShowUserDetails(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;