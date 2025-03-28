import React from 'react';
import { useState, useEffect } from "react";
import { useLocation,useParams } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaMoneyBillWave } from 'react-icons/fa';
import { SiGooglepay, SiPhonepe, SiApplepay } from 'react-icons/si';

const FoodItem = () => {
    const location = useLocation();
    const { restaurantId, restaurantName } = location.state;
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { username } = useParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [currentLocation, setcurrentLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);


    useEffect(() => {
        if (!restaurantId) {
            console.error("Restaurant ID is undefined");
            return;
        }
    
        const fetchFoodItems = async () => {
            setLoading(true);
            try {
                console.log("Restaurant ID in frontend:", restaurantId);
                const response = await fetch(`http://localhost:3000/api/food/${restaurantId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch food items");
                }
                const data = await response.json();
                setFoodItems(data);
            } catch (error) {
                console.error("Error fetching food items:", error);
                setError("Error fetching food items. Please try again.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchFoodItems();
    }, [restaurantId]);


    if (loading) return <p>Loading food items...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    
    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem._id === item._id);

        if (existingItem) {
            const updatedCart = cart.map(cartItem =>
                cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        const updatedCart = cart.filter(cartItem => cartItem._id !== itemId);
        setCart(updatedCart);
    };

    const updateQuantity = (itemId, amount) => {
        const updatedCart = cart.map(item => {
            if (item._id === itemId) {
                const newQuantity = item.quantity + amount;
                return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
            }
            return item;
        });
        setCart(updatedCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const itemPrice = item.discount > 0 ? item.discountPrice : item.price;
            return total + itemPrice * item.quantity;
        }, 0).toFixed(2);
    };

    const handleProceedToPayment = () => {
        setShowPayment(true);
    };
    
    const handleSubmitPayment = () => {
        if (selectedMethod) {
            alert(`Payment method selected: ${selectedMethod}`);
            // You can proceed with your payment process here
        } else {
            alert("Please select a payment method.");
        }
    };



    return (
        <div>
            {/* Navbar */}
            <nav className="bg-[#8A4F7D] text-white backdrop-blur-md shadow-lg p-2 flex justify-between items-center fixed top-0 w-full z-50">
                <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg font-bold tracking-wide italic drop-shadow-md"
                >
                    Foodie
                </motion.h1>

                <h2 className="text-yellow-300 italic text-lg font-semibold">
                    {restaurantName || "Loading..."}
                </h2>

                <div className="flex items-center space-x-5">
                    <div className="group flex flex-col items-center cursor-pointer">
                        <FaUserCircle className="text-xl text-white transition-transform group-hover:scale-110 opacity-90" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white mt-1">
                            {username}
                        </span>
                    </div>
                    <div 
                        className="group flex flex-col items-center cursor-pointer"
                        onClick={() => setIsDrawerOpen(true)}
                    >
                        <FaShoppingCart className="text-lg text-white transition-transform group-hover:scale-110 opacity-90" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white mt-1">
                            Cart
                        </span>
                    </div>
                </div>
            </nav>

            <div className={`flex transition-all duration-500 mt-14`}>
                {/* Food Items */}
                <div 
                    className={`transition-all duration-500 ${isDrawerOpen ? "pr-[25%]" : "w-full"}`}
                >
                    <div 
                        className="grid gap-10 p-6" 
                        style={{ gridTemplateColumns: isDrawerOpen ? "repeat(4, 1fr)" : "repeat(5, 1fr)" }}
                    >
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : (
                            foodItems.map((item) => (
                                <div key={item._id} className="bg-white shadow-md rounded-xl p-3 border border-gray-200 relative transition-transform duration-300 hover:scale-105">
                                    {item.discount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                                            {item.discount}% OFF
                                        </div>
                                    )}
                                    <img
                                        src={`http://localhost:3000${item.image}`}
                                        alt={item.name}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <h3 className="text-lg font-semibold mt-2 text-gray-800 truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.category}</p>

                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            {item.discount > 0 ? (
                                                <>
                                                    <p className="text-gray-500 line-through text-sm">₹{item.price}</p>
                                                    <p className="font-semibold text-green-600 text-base">₹{item.discountPrice.toFixed(2)}</p>
                                                </>
                                            ) : (
                                                <p className="font-semibold text-gray-700 text-base">₹{item.price}</p>
                                            )}
                                        </div>
                                        <p className={`font-semibold text-sm ${item.availability === "Available" ? "text-green-600" : "text-red-600"}`}>
                                            {item.availability}
                                        </p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button onClick={() => addToCart(item)} className="w-1/2 py-1 rounded-[10px] bg-red-400 text-white hover:bg-red-500 shadow-lg shadow-red-300/50 hover:shadow-red-400/70 transition-all duration-300 backdrop-blur-sm text-sm font-semibold tracking-wide">
                                        Add to Cart
                                     </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Cart Drawer */}
                <div className={`fixed top-14 right-0 h-[calc(100vh-56px)] bg-white shadow-lg border-l transition-all duration-500 ${isDrawerOpen ? "w-1/4" : "w-0 overflow-hidden"}`}>
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="font-semibold text-gray-800">Your Cart</h2>
                <FaTimes className="text-gray-600 cursor-pointer" onClick={() => setIsDrawerOpen(false)} />
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-100px)]">
                {cart.length === 0 ? (
                    <p className="text-gray-500 text-center">Your cart is empty.</p>
                ) : (
                    <div>
                        {cart.map(item => (
                            <div key={item._id} className="flex items-center justify-between bg-white shadow-md rounded-lg p-3 hover:shadow-lg transition-shadow duration-300">
                                <div className="relative flex items-center space-x-4">
                                    <div className="relative">
                                        <img 
                                            src={`http://localhost:3000${item.image}`} 
                                            alt={item.name} 
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        {item.discount > 0 && (
                                            <span className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                                                {((1 - item.discountPrice / item.price) * 100).toFixed(0)}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            {item.discount > 0 ? (
                                                <>
                                                    <span className="line-through text-gray-500 text-xs">₹{item.price.toFixed(2)}</span>
                                                    <span className="text-red-500 font-bold text-sm">₹{item.discountPrice.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-sm">₹{item.price.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <button onClick={() => updateQuantity(item._id, -1)} className="bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center transition hover:bg-red-500">-</button>
                                    <span className="font-semibold text-gray-800 text-sm">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, 1)} className="bg-green-400 text-white rounded-full w-6 h-6 flex items-center justify-center transition hover:bg-green-500">+</button>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 transition text-sm">✖</button>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4 flex justify-between items-center border-t border-gray-300 pt-3">
                            <div className="font-bold text-lg text-teal-600 tracking-wide">Total: <span className="text-pink-600">₹{calculateTotal()}</span></div>
                            <button 
                                className="bg-[#8A4F7D] text-white px-3 py-1 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300"
                                onClick={() => setShowForm(true)}
                            >
                                Proceed
                            </button>
                        </div>

                        {showForm && (
    <div className="mt-4 p-6 bg-white shadow-xl rounded-3xl border border-gray-300 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400">
        {/* Form Title */}
        <h2 className="text-1.8xl font-extrabold text-gradient bg-[#8A4F7D] text-transparent bg-clip-text mb-6 text-center">
            Shipping Details
        </h2>

        {/* Form Fields */}
        <div className="space-y-6">
            {/* Name Field */}
            <div className="relative">
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                    placeholder="Enter Your Name"
                />
            </div>

            {/* Location Field */}
            <div className="relative">
                <input 
                    type="text" 
                    value={currentLocation} 
                    onChange={(e) => setcurrentLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                    placeholder="Enter Your Location"
                />
            </div>

            {/* Phone Number Field */}
            <div className="relative">
                <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-purple-500 transition-all duration-200"
                    placeholder="Enter Your Phone Number"
                />
            </div>
        </div>

        {/* Next Proceed Button */}
        {name.trim() && currentLocation.trim() && phone.trim() && (
            <div className="flex justify-center mt-8">
                <button 
                    onClick={handleProceedToPayment}
                    className="bg-[#8A4F7D] text-white text-md px-6 py-2 rounded-[15px] shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    Proceed to Payment
                </button>
            </div>
        )}
    </div>
)}
{showPayment && (
                <div className="mt-4 p-4 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-400 w-[85%] mx-auto">
                    <h2 className="text-lg font-bold text-[#8A4F7D] mb-4 text-center">
                        Select Payment Method
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {[
                            { name: "Cash on Delivery", icon: <FaMoneyBillWave size={28} className="text-green-600" /> },
                            { name: "Google Pay", icon: <SiGooglepay size={28} className="text-blue-600" /> },
                            { name: "PhonePe", icon: <SiPhonepe size={28} className="text-purple-700" /> },
                            { name: "Apple Pay", icon: <SiApplepay size={28} className="text-gray-800" /> },
                        ].map((method) => (
                            <div
                                key={method.name}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md cursor-pointer transition-all duration-300 border ${
                                    selectedMethod === method.name ? "ring-4 ring-[#8A4F7D] border-transparent" : "border-gray-300"
                                } hover:shadow-lg hover:scale-105 hover:bg-white/95`}
                                onClick={() => setSelectedMethod(method.name)}
                            >
                                <div className="mb-2">{method.icon}</div>
                                <p className="text-sm font-medium text-gray-700">{method.name}</p>
                            </div>
                        ))}
                    </div>

                    {selectedMethod && (
                        <div className="flex justify-center mt-4">
                            <button 
                                onClick={handleSubmitPayment}
                                className="bg-[#8A4F7D] text-white text-sm px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                            >
                                Submit Payment
                            </button>
                        </div>
                    )}
                </div>
            )}

                    </div>
                )}
            </div>
        </div>
     </div>
    </div>
    );
}

export default FoodItem;
