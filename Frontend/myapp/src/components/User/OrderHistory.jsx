import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  FaClock, 
  FaUtensils, 
  FaCheck, 
  FaTruck, 
  FaHome, 
  FaTimes,
  FaStar,
  FaRegStar,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaRegCircle
} from "react-icons/fa";
import axios from "axios";

const OrderHistory = () => {
  const { username } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/history/${username}`);
        if (!response.ok) throw new Error("Failed to fetch order history");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [username]);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Preparing: "bg-blue-100 text-blue-800",
    Ready: "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800"
  };

  const statusSteps = [
    { name: "Pending", icon: <FaClock /> },
    { name: "Preparing", icon: <FaUtensils /> },
    { name: "Ready", icon: <FaCheck /> },
    { name: "Out for Delivery", icon: <FaTruck /> },
    { name: "Delivered", icon: <FaHome /> }
  ];

  const handleCancelOrder = async (orderId) => {
    setCancelling(orderId);
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}/cancel`);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Cancelled" } : order
      ));
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setCancelling(null);
    }
  };

  const canCancelOrder = (order) => {
    // Only allow cancellation for Pending and Preparing statuses
    return order.status === "Pending" || order.status === "Preparing";
  };
  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaTimes className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <div className="text-sm text-gray-500">
          Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <FaUtensils className="w-full h-full" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-1 text-gray-500">Your order history will appear here once you place an order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <div 
                className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleExpandOrder(order._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.substring(18, 24).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-gray-400">
                      {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                </div>
              </div>

              {expandedOrder === order._id && (
                <div className="border-t border-gray-200 px-4 sm:px-6 py-4">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column - Items and Timeline */}
                    <div className="lg:w-2/3 space-y-6">
                      {/* Order Items */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Items</h3>
                        <div className="space-y-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <img 
                                src={`http://localhost:3000${item.image}`} 
                                alt={item.name} 
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="ml-4 flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {item.quantity} × ₹{item.discountPrice || item.price}
                                </p>
                              </div>
                              <p className="font-medium">
                                ₹{(item.discountPrice || item.price) * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Linear Timeline */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-3">Order Status</h3>
                        <div className="relative pl-8">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          {statusSteps.map((step, index) => {
                            const isCompleted = statusSteps.findIndex(s => s.name === order.status) >= index;
                            const isCurrent = order.status === step.name;
                            const isCancelled = order.status === "Cancelled";
                            
                            return (
                              <div key={index} className="relative flex items-start pb-6 last:pb-0">
                                <div className="absolute left-0 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10">
                                  {isCancelled ? (
                                    <FaTimes className="text-sm text-red-500" />
                                  ) : isCompleted ? (
                                    <FaCircle className={`text-sm ${isCurrent ? 'text-blue-500' : 'text-green-500'}`} />
                                  ) : (
                                    <FaRegCircle className="text-sm text-gray-400" />
                                  )}
                                </div>
                                <div className="ml-3">
                                  <p className={`text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.name}
                                  </p>
                                  {isCurrent && !isCancelled && (
                                    <p className="text-xs text-blue-500 mt-1">Your order is {step.name.toLowerCase()}</p>
                                  )}
                                  {isCancelled && index === 0 && (
                                    <p className="text-xs text-red-500 mt-1">Order was cancelled</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Summary and Actions */}
                    <div className="lg:w-1/3">
                      <div className="bg-gray-50 p-4 rounded-lg sticky top-4">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span>₹{order.deliveryFee || '0.00'}</span>
                          </div>
                          <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">₹{(order.subtotal + (order.deliveryFee || 0)).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          {order.status === "Delivered" && (
                            <Link
                              to={`/feedback/${order._id}`}
                              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Rate Your Order
                            </Link>
                          )}
                          {canCancelOrder(order) && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancelling === order._id}
                              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                cancelling === order._id
                                  ? "bg-gray-500"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;