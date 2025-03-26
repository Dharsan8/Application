import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBox, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-[#8A4F7D] text-white p-4 flex justify-between items-center shadow-md">
            <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-bold tracking-wide italic drop-shadow-md"
            >
                Foodie
            </motion.h1>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-2xl" />
                    <span>{username}</span>
                </div>

                <Link to="/cart" className="flex items-center space-x-2">
                    <FaShoppingCart className="text-xl" />
                    <span>Cart</span>
                </Link>

                <Link to="/order-history" className="flex items-center space-x-2">
                    <FaBox className="text-xl" />
                    <span>My Orders</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
