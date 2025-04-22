import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMotorcycle, FaCheck, FaTimes, FaSignOutAlt, FaUser, FaMapMarkerAlt, FaMap, FaTruck } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import Notification from "../Notification";

const DeliveryDashboard = () => {
  const [deliveryPerson, setDeliveryPerson] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem("deliveryData");
        if (!storedData) {
          navigate("/delivery-auth");
          return;
        }


        const parsedData = JSON.parse(storedData);
        setDeliveryPerson(parsedData);

  
        // Fetch orders for this delivery person
        const response = await axios.get(
          `http://localhost:3000/api/orders/delivery/${parsedData._id}`
        );
        
        // Additional client-side filtering by city
        const filteredOrders = response.data.filter(order => {
          const address = order.deliveryAddress || order.customer.location || "";
          return address.toLowerCase().includes(parsedData.city.toLowerCase());
        });
        
        setOrders(filteredOrders);
        const shouldShow = sessionStorage.getItem("showWelcome");
        if (shouldShow) {
          setShowNotification(true);
          sessionStorage.removeItem("showWelcome");
        }
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
    navigate("/delivery-auth");
  };

  const acceptOrder = async (orderId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/accept-delivery`,
        { 
          deliveryPersonId: deliveryPerson._id,
          deliveryPersonCity: deliveryPerson.city
        }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId ? response.data : order
      ));
    } catch (err) {
      console.error("Failed to accept order:", err);
      alert(err.response?.data?.message || "Failed to accept order");
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: "Delivered",
        deliveryPersonId: deliveryPerson._id
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: "Delivered" } : order
      ));
    } catch (err) {
      console.error("Failed to mark as delivered:", err);
      alert("Failed to mark as delivered");
    }
  };

  const rejectOrder = async (orderId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/reject-delivery`,
        { deliveryPersonId: deliveryPerson._id }
      );
      
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error("Failed to reject order:", err);
      alert("Failed to reject order");
    }
  };

  const openGoogleMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {showNotification && (
        <Notification
          message={`Welcome back, ${deliveryPerson?.name || "Delivery Partner"}!`}
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
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
              <span>{deliveryPerson?.name} ({deliveryPerson?.city})</span>
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

        <h2 className="text-xl font-semibold mb-4">Available Orders in {deliveryPerson?.city}</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders available in your area at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => {
              const orderCity = (order.deliveryAddress || order.customer.location || "").toLowerCase();
              const deliveryCity = deliveryPerson?.city?.toLowerCase() || "";
              
              // Skip rendering if cities don't match (additional safety check)
              if (!orderCity.includes(deliveryCity)) {
                return null;
              }

              return (
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Restaurant:</span> {order.restaurant.name}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Customer:</span> {order.customer.name}
                      </p>
                      <p className="text-sm mb-3">
                        <span className="font-medium">Total:</span> ₹{order.subtotal.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                        <div>
                          <p className="font-medium">Delivery Address:</p>
                          <p className="text-sm">{order.deliveryAddress || order.customer.location}</p>
                          <button 
                            onClick={() => openGoogleMaps(order.deliveryAddress || order.customer.location)}
                            className="mt-2 text-blue-500 hover:text-blue-700 text-sm flex items-center"
                          >
                            <FaMap className="mr-1" />
                            Open in Maps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    {order.status === "Ready" && !order.deliveryPersonId && (
                      <>
                        <button
                          onClick={() => acceptOrder(order._id)}
                          className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 flex-1 flex items-center justify-center"
                        >
                          <FaCheck className="mr-2" />
                          Accept Order
                        </button>
                        <button
                          onClick={() => rejectOrder(order._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 flex-1 flex items-center justify-center"
                        >
                          <FaTimes className="mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {order.deliveryPersonId === deliveryPerson?._id && order.status === "Out for Delivery" && (
                      <button
                        onClick={() => markAsDelivered(order._id)}
                        className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 w-full flex items-center justify-center"
                      >
                        <FaTruck className="mr-2" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboard;