import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";

const FeedbackForm = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({
    name: "",
    restaurantName: "",
    rating: 0,
    foodQuality: 0,
    deliveryExperience: 0,
    comments: ""
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/orders/${orderId}`);
        if (response.data.status !== "Delivered") {
          throw new Error("This order is not eligible for feedback");
        }
        setOrderDetails(response.data);
        // Set restaurant name from order details
        setFeedback(prev => ({
          ...prev,
          restaurantName: response.data.restaurant?.name || ""

        }));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleRatingChange = (category, value) => {
    setFeedback(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("http://localhost:3000/api/feedback", {
        orderId,
        restaurantId: orderDetails?.restaurant?.id,

        restaurantName: feedback.restaurantName,
        name: feedback.name,
        rating: feedback.rating,
        foodQuality: feedback.foodQuality,
        deliveryExperience: feedback.deliveryExperience,
        comments: feedback.comments
      });
      setSuccess(true);
      setTimeout(() => navigate(`/order-history/${orderDetails.customer.username}`), 2000);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaTimes className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate(`/order-history/${orderDetails?.customer?.username || ''}`)}
        className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Back to Order History
      </button>
    </div>
  );

  if (success) return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-green-50 border-l-4 border-green-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaCheck className="h-5 w-5 text-green-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">Thank you for your feedback! Redirecting back to order history...</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Rate Your Order #{orderId.substring(18, 24).toUpperCase()} from {orderDetails?.restaurant?.restaurantName || "Restaurant"}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hidden restaurant fields */}
        <input 
          type="hidden" 
          name="restaurantName" 
          value={feedback.restaurantName} 
        />
        <input 
          type="hidden" 
          name="restaurantId" 
          value={orderDetails?.restaurant?.restaurantID || ""} 
        />

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
            value={feedback.name}
            onChange={(e) => setFeedback({...feedback, name: e.target.value})}
            required
          />
        </div>

        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange("rating", star)}
                className="text-2xl focus:outline-none"
              >
                {star <= feedback.rating ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Food Quality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food Quality</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange("foodQuality", star)}
                className="text-2xl focus:outline-none"
              >
                {star <= feedback.foodQuality ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Experience</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange("deliveryExperience", star)}
                className="text-2xl focus:outline-none"
              >
                {star <= feedback.deliveryExperience ? (
                  <FaStar className="text-yellow-400" />
                ) : (
                  <FaRegStar className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments
          </label>
          <textarea
            id="comments"
            rows={4}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            value={feedback.comments}
            onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
            maxLength="500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {500 - feedback.comments.length} characters remaining
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(`/order-history/${orderDetails?.customer?.username || ''}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !feedback.name || feedback.rating === 0 || feedback.foodQuality === 0 || feedback.deliveryExperience === 0}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              submitting || !feedback.name || feedback.rating === 0 || feedback.foodQuality === 0 || feedback.deliveryExperience === 0
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;