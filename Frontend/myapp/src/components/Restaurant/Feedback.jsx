import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaStar, 
  FaRegStar, 
  FaSpinner, 
  FaExclamationTriangle,
  FaUtensils,
  FaMotorcycle,
  FaBoxOpen,
  FaChartLine
} from 'react-icons/fa';

const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const restaurant = JSON.parse(localStorage.getItem("restaurantData"));

    useEffect(() => {
        let isMounted = true;
    
        const fetchData = async () => {
            try {
                if (!restaurant?.restaurantID) {
                    throw new Error("Restaurant data not found");
                }
    
                // Fetch food items for this restaurant
                const foodResponse = await axios.get(
                    `http://localhost:3000/api/food/restaurant/${restaurant.restaurantID}`,
                    { timeout: 5000 }
                );
    
                // Fetch feedback for this specific restaurant
                const feedbackResponse = await axios.get(
                    `http://localhost:3000/api/feedback/restaurant/${restaurant.restaurantID}`,
                    { timeout: 5000 }
                );
    
                if (isMounted) {
                    setFoodItems(foodResponse.data);
                    setFeedbackData(feedbackResponse.data);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message);
                    setLoading(false);
                    console.error("Fetch error:", error);
                }
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false;
        };
    }, [restaurant?.restaurantID]);

    const renderStars = (rating) => {
        const numericRating = Number(rating) || 0;
        return Array(5).fill(0).map((_, i) => (
            i < numericRating ? 
                <FaStar key={i} className="text-yellow-400 inline-block" /> : 
                <FaRegStar key={i} className="text-gray-300 inline-block" />
        ));
    };

    const calculateAverageRating = (foodItemId) => {
        const itemFeedbacks = feedbackData.filter(fb => fb.foodItemId === foodItemId);
        if (itemFeedbacks.length === 0) return 0;
        
        const total = itemFeedbacks.reduce((sum, fb) => sum + fb.rating, 0);
        return (total / itemFeedbacks.length).toFixed(1);
    };

    const filteredFeedback = feedbackData.filter(feedback => {
        const matchesSearch = feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'high') return feedback.rating >= 4 && matchesSearch;
        if (activeTab === 'low') return feedback.rating <= 2 && matchesSearch;
        return matchesSearch;
    });

    const stats = {
        totalFeedback: feedbackData.length,
        averageRating: feedbackData.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbackData.length || 0,
        foodQualityAvg: feedbackData.reduce((acc, curr) => acc + (curr.foodQuality || 0), 0) / feedbackData.length || 0,
        deliveryAvg: feedbackData.reduce((acc, curr) => acc + (curr.deliveryExperience || 0), 0) / feedbackData.length || 0,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
                <span className="ml-3">Loading data...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-red-500 mr-3" />
                        <div>
                            <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        {restaurant?.restaurantName || 'Restaurant'} Feedback Analytics
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Comprehensive insights about your products and services
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <FaChartLine className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Feedback</p>
                                <h3 className="text-2xl font-bold">{stats.totalFeedback}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <FaStar className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Avg. Rating</p>
                                <h3 className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                <FaUtensils className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Food Quality</p>
                                <h3 className="text-2xl font-bold">{stats.foodQualityAvg.toFixed(1)}/5</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                                <FaMotorcycle className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Delivery Experience</p>
                                <h3 className="text-2xl font-bold">{stats.deliveryAvg.toFixed(1)}/5</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                All Feedback
                            </button>
                            <button
                                onClick={() => setActiveTab('high')}
                                className={`px-4 py-2 rounded-lg ${activeTab === 'high' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Positive (4+)
                            </button>
                            <button
                                onClick={() => setActiveTab('low')}
                                className={`px-4 py-2 rounded-lg ${activeTab === 'low' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Negative (≤2)
                            </button>
                        </div>
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search feedback..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Feedback Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
                            
                            {filteredFeedback.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                                        <FaBoxOpen className="w-full h-full" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">No feedback found</h3>
                                    <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredFeedback.map((feedback) => (
                                        <div 
                                            key={feedback._id} 
                                            className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex items-start">
                                                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                                                    {feedback.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium text-gray-900">{feedback.name || 'Anonymous'}</h3>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(feedback.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mt-2 mb-3">
                                                        <div className="flex items-center">
                                                            <span className="text-gray-700 mr-2">Overall:</span>
                                                            {renderStars(feedback.rating)}
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                ({feedback.rating}/5)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {feedback.comments && (
                                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                                            <p className="text-gray-600">"{feedback.comments}"</p>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Food Quality</p>
                                                            <div className="flex items-center">
                                                                {renderStars(feedback.foodQuality)}
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    ({feedback.foodQuality}/5)
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Delivery</p>
                                                            <div className="flex items-center">
                                                                {renderStars(feedback.deliveryExperience)}
                                                                <span className="ml-2 text-sm text-gray-500">
                                                                    ({feedback.deliveryExperience}/5)
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Product Ratings Section */}
                    <div>
                        <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Product Ratings</h2>
                            
                            {foodItems.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="mx-auto h-16 w-16 text-gray-400 mb-3">
                                        <FaUtensils className="w-full h-full" />
                                    </div>
                                    <p className="text-gray-500">No products available for this restaurant</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {foodItems.map(item => (
                                        <div key={item._id} className="border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex items-start">
                                                <img 
                                                    src={`http://localhost:3000${item.image}`}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-lg mr-4"
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = '/images/food-placeholder.png';
                                                    }}
                                                />
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">{item.category}</p>
                                                    <div className="mt-1 flex items-center">
                                                        {renderStars(item.averageRating || calculateAverageRating(item._id))}
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({item.averageRating?.toFixed(1) || calculateAverageRating(item._id)}/5) • 
                                                            {item.ratings?.length || feedbackData.filter(fb => fb.foodItemId === item._id).length} reviews
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;