import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const Feedback = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/feedback', {
                    validateStatus: function (status) {
                        return status < 500; // Reject only if status is 500 or higher
                    }
                });
                
                if (response.status === 404) {
                    throw new Error('Feedback endpoint not found. Is the server running?');
                }
                
                setFeedbackData(response.data);
            } catch (err) {
                setError(err.message || 'Failed to fetch feedback data');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);
    
    const renderStars = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            i < rating ? 
                <FaStar key={i} className="text-yellow-400 inline-block" /> : 
                <FaRegStar key={i} className="text-gray-300 inline-block" />
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
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
                            <h3 className="text-lg font-medium text-red-800">Error loading feedback</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Customer Feedback
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Here's what our customers are saying about us
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {feedbackData.map((feedback) => (
                        <div 
                            key={feedback._id} 
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                    {feedback.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-medium text-gray-900">{feedback.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center mb-1">
                                    <span className="text-gray-700 mr-2">Overall:</span>
                                    {renderStars(feedback.rating)}
                                </div>
                                <div className="flex items-center mb-1">
                                    <span className="text-gray-700 mr-2">Food Quality:</span>
                                    {renderStars(feedback.foodQuality)}
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-2">Delivery:</span>
                                    {renderStars(feedback.deliveryExperience)}
                                </div>
                            </div>

                            {feedback.comments && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-gray-600 italic">"{feedback.comments}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {feedbackData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <FaRegStar className="w-full h-full" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No feedback yet</h3>
                        <p className="mt-1 text-gray-500">Customer feedback will appear here once submitted.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feedback;