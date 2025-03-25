import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaBox, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Import motion from framer-motion
const UserDashboard = () => {
    const { username } = useParams(); // Get username from URL
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored auth data (if stored in localStorage/sessionStorage)
        localStorage.removeItem('token'); 
        navigate('/login'); // Redirect to login page
    };

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="bg-[#8A4F7D] text-white p-4 flex justify-between items-center">
                <motion.h1
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-lg font-bold text-white-600 tracking-wide italic drop-shadow-md"
                        >
                          Foodie
                        </motion.h1>
                
                <div className="flex items-center space-x-6">
                    {/* User Icon with Name */}
                    <div className="flex items-center space-x-2">
                        <FaUserCircle className="text-2xl" />
                        <span>{username}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <Link to="/cart" className="flex items-center space-x-2">
                        <FaShoppingCart className="text-xl" />
                        <span>Cart</span>
                    </Link>

                    {/* My Orders Button */}
                    <Link to="/order-history" className="flex items-center space-x-2">
                        <FaBox className="text-xl" />
                        <span>My Orders</span>
                    </Link>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Welcome Message */}
            <div className="text-center mt-10">
                <h1 className="text-5xl font-bold">Hello, {username}!</h1>
            </div>
        </div>
    );
}

export default UserDashboard;
