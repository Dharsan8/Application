import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMotorcycle, FaCheck, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";

const DeliveryDashboard = () => {
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("deliveryData");
        if (!storedData) {
          navigate("/delivery-login");
          return;
        }

        const parsedData = JSON.parse(storedData);
        setDeliveryPerson(parsedData);

        // Fetch orders assigned to this delivery person
        const response = await axios.get(`http://localhost:3000/api/orders/delivery/${parsedData._id}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("deliveryData");
    navigate("/delivery-login");
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status,
        deliveryPersonId: deliveryPerson._id
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#8A4F7D] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaMotorcycle className="text-2xl" />
            <h1 className="text-xl font-bold">Delivery Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser />
              <span>{deliveryPerson?.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:text-gray-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Name:</span> {deliveryPerson?.name}</p>
              <p><span className="font-medium">Email:</span> {deliveryPerson?.email}</p>
              <p><span className="font-medium">Phone:</span> {deliveryPerson?.phone}</p>
            </div>
            <div>
              <p><span className="font-medium">Location:</span> {deliveryPerson?.location}</p>
              <p><span className="font-medium">City:</span> {deliveryPerson?.city}</p>
              <p><span className="font-medium">Status:</span> {deliveryPerson?.status}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Assigned Orders</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders assigned to you yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === "Ready" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "Out for Delivery" ? "bg-blue-100 text-blue-800" :
                    order.status === "Delivered" ? "bg-green-100 text-green-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  From: {order.restaurantName}
                </p>
                
                <p className="text-sm mb-2">
                  <span className="font-medium">Customer:</span> {order.customer.name}
                </p>
                
                <p className="text-sm mb-2">
                  <span className="font-medium">Address:</span> {order.deliveryAddress}
                </p>
                
                <p className="text-sm mb-3">
                  <span className="font-medium">Total:</span> ₹{order.subtotal.toFixed(2)}
                </p>
                
                <div className="flex space-x-2">
                  {order.status === "Ready" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "Out for Delivery")}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Accept Order
                    </button>
                  )}
                  
                  {order.status === "Out for Delivery" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "Delivered")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboard;