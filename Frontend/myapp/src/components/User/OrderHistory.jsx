import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaUtensils, FaCheck, FaTruck, FaHome, FaTimes } from "react-icons/fa";

const OrderHistory = () => {
  const { username } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/history/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }
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

  const statusSteps = ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered"];
  const statusIcons = {
    Pending: <FaClock />,
    Preparing: <FaUtensils />,
    Ready: <FaCheck />,
    "Out for Delivery": <FaTruck />,
    Delivered: <FaHome />,
    Cancelled: <FaTimes className="text-red-500" />,
  };

  const getStatusIndex = (status) => statusSteps.indexOf(status);

  if (loading) return <div className="text-center py-8">Loading order history...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order #{order._id.substring(18, 24).toUpperCase()}
                    </h2>
                    <p className="text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString()} • {order.restaurant.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <img 
                        src={`http://localhost:3000${item.image}`} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">
                          {item.quantity} × ₹{item.discountPrice ? item.discountPrice : item.price}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{(item.discountPrice ? item.discountPrice : item.price) * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🚀 Status Timeline */}
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Order Progress</h3>
                <div className="relative flex justify-between items-center w-full px-4">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                          getStatusIndex(order.status) >= index ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {statusIcons[step]}
                      </div>
                      <p className={`text-sm mt-2 ${getStatusIndex(order.status) >= index ? "text-green-600 font-medium" : "text-gray-500"}`}>
                        {step}
                      </p>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute top-4 left-10 w-20 h-1 ${
                            getStatusIndex(order.status) > index ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex justify-between items-center">
                <p className="text-gray-700">Total: ₹{order.subtotal.toFixed(2)}</p>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
