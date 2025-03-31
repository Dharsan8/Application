import React, {useState, useEffect}from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaBox, FaUserCircle, FaSignOutAlt, FaSearch, FaShippingFast } from "react-icons/fa";

const Navbar = ({ searchQuery, setSearchQuery }) => {
    const { username } = useParams();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };



    return (
        <nav className="bg-[#8A4F7D] text-white backdrop-blur-md shadow-lg p-2 flex justify-between items-center fixed top-0 w-full z-50">
            <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-bold tracking-wide italic drop-shadow-md"
            >
                Foodie
            </motion.h1>
            
            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-xs">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-1 border border-white/50 rounded-full bg-transparent text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute right-3 text-white text-lg cursor-pointer opacity-80" />
            </div>

    {/* Navigation Icons */}
    <div className="flex items-center space-x-5">
        {/* Profile */}
        <div className="group flex flex-col items-center cursor-pointer">
            <FaUserCircle className="text-xl text-white transition-transform group-hover:scale-110 opacity-90" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white mt-1">
                {username}
            </span>
        </div>

        {/* Cart */}
        <Link to="/cart" className="group flex flex-col items-center">
            <FaShoppingCart className="text-lg text-white transition-transform group-hover:scale-110 opacity-90" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white mt-1">
                Cart
            </span>
        </Link>

        {/* Orders */}
       {/* Orders */}

       
       <Link 
  to={`/order-history/${username}`} 
  className="group flex flex-col items-center"
>
  <FaBox className="text-lg text-white transition-transform group-hover:scale-110 opacity-90" />
  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white mt-1">
    Order History
  </span>
</Link>

{/* Tracking */}

        {/* Logout */}
        <button
            onClick={handleLogout}
            className="group flex flex-col items-center"
        >
            <FaSignOutAlt className="text-lg text-red-400 transition-transform group-hover:scale-110 opacity-90" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 mt-1">
                Logout
            </span>
        </button>
    </div>
        </nav>
    );
};

export default Navbar;
