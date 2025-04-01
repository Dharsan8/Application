import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHourglassHalf, FaUtensils, FaCheck, FaTruck, FaTimes } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const restaurantData = JSON.parse(localStorage.getItem("restaurantData"));
        console.log("Restaurant Data from localStorage:", restaurantData);
        
        if (!restaurantData || !restaurantData.restaurantID) {
          throw new Error("Restaurant data not found");
        }

        const response = await axios.get(
          `http://localhost:3000/api/orders/restaurant/${restaurantData.restaurantID}`
        );
        console.log("API Response:", response.data);
        setOrders(response.data);
      } catch (err) {
        console.error("Error details:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FaHourglassHalf className="text-yellow-500" />;
      case "Preparing": return <FaUtensils className="text-blue-500" />;
      case "Ready": return <FaCheck className="text-green-500" />;
      case "Out for Delivery": return <FaTruck className="text-purple-500" />;
      case "Delivered": return <FaTruck className="text-green-700" />;
      case "Cancelled": return <FaTimes className="text-red-500" />;
      default: return null;
    }
  };

  // Helper function to determine if a button should be shown
  const shouldShowButton = (currentStatus, targetStatus) => {
    const statusFlow = ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered"];
    
    // Don't show if already cancelled or delivered
    if (currentStatus === "Cancelled" || currentStatus === "Delivered") {
      return false;
    }
    
    // Only show if current status is immediately before target in flow
    const currentIndex = statusFlow.indexOf(currentStatus);
    const targetIndex = statusFlow.indexOf(targetStatus);
    
    return currentIndex === targetIndex - 1;
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#8A4F7D]">Orders</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found</p>
            ) : (
              orders.map(order => (
                <div 
                  key={order._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?._id === order._id ? "border-[#8A4F7D] bg-purple-50" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm">{order.status}</span>
                    </div>
                  </div>
                  <p className="text-sm mt-1">
                    {order.items.length} items • ₹{order.subtotal.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          {selectedOrder ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-medium">{selectedOrder.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customer.phone}</p>
                  <p><span className="font-medium">Location:</span> {selectedOrder.customer.location}</p>
                  {selectedOrder.deliveryAddress && (
                    <p><span className="font-medium">Delivery Address:</span> {selectedOrder.deliveryAddress}</p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                  <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.subtotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <img 
                        src={`http://localhost:3000${item.image}`} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-md object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{(item.discountPrice || item.price).toFixed(2)}
                        </p>
                        {item.discountPrice && (
                          <p className="text-xs text-gray-500 line-through">
                            ₹{item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-3">
                {shouldShowButton(selectedOrder.status, "Preparing") && (
                  <button
                    onClick={() => updateStatus(selectedOrder._id, 'Preparing')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Start Preparing
                  </button>
                )}
                
                {shouldShowButton(selectedOrder.status, "Ready") && (
                  <button
                    onClick={() => updateStatus(selectedOrder._id, 'Ready')}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Mark as Ready
                  </button>
                )}
                
                {shouldShowButton(selectedOrder.status, "Out for Delivery") && (
                  <button
                    onClick={() => updateStatus(selectedOrder._id, 'Out for Delivery')}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                  >
                    Assign for Delivery
                  </button>
                )}
                
                {(selectedOrder.status === "Cancelled" || selectedOrder.status === "Delivered") && (
                  <button
                    disabled
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    {selectedOrder.status === "Cancelled" ? "Order Cancelled" : "Order Delivered"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;