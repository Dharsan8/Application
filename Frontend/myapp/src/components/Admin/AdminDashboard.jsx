
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChartPie, FaStore, FaComments, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaTrash, FaMotorcycle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin-login");
  };

  const fetchDeliveryPersons = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/delivery");
      setDeliveryPersons(response.data);
    } catch (error) {
      console.error("Error fetching delivery persons:", error);
    }
  };

  useEffect(() => {
    if (activeSection === "delivery") {
      fetchDeliveryPersons();
    }
  }, [activeSection]);

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  // Fetch restaurants from backend
  const fetchRestaurants = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/restaurants/all");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Handle Approval or Rejection
  const handleApproval = async (restaurant, status) => {
    try {
      const response = await axios.post("http://localhost:3000/api/restaurants/approve", { restaurant, status });
      if (response.status !== 200) throw new Error("Approval API failed");
      alert(`Restaurant ${status} successfully!`);
      fetchRestaurants();
    } catch (error) {
      console.error("Error processing approval:", error);
      alert("Failed to update restaurant status.");
    }
  };

  // Handle Delete
  const handleDelete = async (id, email) => {
    try {
      await axios.delete(`http://localhost:3000/api/restaurants/delete/${id}/${encodeURIComponent(email)}`);
      alert("Deleted Successfully!");
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      alert("Failed to delete restaurant");
    }
  };

  const handleDeliveryApproval = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/delivery/${id}/status`, { status });
      alert(`Delivery person ${status.toLowerCase()} successfully!`);
      fetchDeliveryPersons();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("Failed to update delivery status");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* sideNavbar */}
      <div className="w-16 bg-[#8A4F7D] text-white flex flex-col items-center py-6 shadow-lg">
        <motion.h1 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="text-lg font-bold text-orange-600 tracking-wide italic drop-shadow-md" > Foodie </motion.h1>
        <div className="flex-1 flex flex-col justify-center items-center gap-8">
          <button onClick={() => setActiveSection("restaurants")} className="p-4 rounded-full hover:bg-[#7F5539] transition relative group flex justify-center items-center" >
            <span className="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition"> Approvals </span>
            <FaStore size={26} />
          </button>
          <button onClick={() => setActiveSection("analytics")} className="p-4 rounded-full hover:bg-[#7F5539] transition relative group flex justify-center items-center" >
            <span className="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition"> Analytics </span>
            <FaChartPie size={26} />
          </button>
         

      <button onClick={() => setActiveSection("delivery")} className="p-4 rounded-full hover:bg-[#7F5539] transition relative group flex justify-center items-center" >
        <span className="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition"> Delivery </span>
        <FaMotorcycle size={26} />
      </button>
      <button onClick={() => setActiveSection("feedback")} className="p-4 rounded-full hover:bg-[#7F5539] transition relative group flex justify-center items-center" >
        <span className="absolute -top-8 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition"> Feedback </span>
        <FaComments size={26} />
      </button>
    </div>
    <button onClick={handleLogout} className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition flex justify-center items-center" >
      <FaSignOutAlt size={18} />
    </button>
  </div>
  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    {/* Top Navbar */}
    <div className="w-full bg-[#8A4F7D] text-white text-center py-3 shadow-md">
      <h1 className="text-lg font-bold">Admin Dashboard</h1>
    </div>
    {/* Section Rendering */}
    <div className="flex-1">
      {activeSection === "restaurants" && (
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-3xl font-bold text-[#7F5539] text-center mb-6 uppercase tracking-wide relative">
            <span className="px-4 py-1 bg-[#E1C699] rounded-lg shadow-md"> Registered Restaurants </span>
          </h2>
          {restaurants.length === 0 ? (
            <p className="text-gray-500 p-6 text-lg text-center">No registered restaurants found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-gray-300 hover:shadow-3xl transition-transform transform hover:-translate-y-2 flex flex-col">
                  {/* Card Header */}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">Not Approved</div>
                  {/* Restaurant Details */}
                  <h2 className="text-2xl font-bold text-[#7F5539] mb-3 text-center">{restaurant.restaurantName}</h2>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Location :</span>
                      <span className="font-medium">{restaurant.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">OwnerName :</span>
                      <span className="font-medium">{restaurant.ownerName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Phone :</span>
                      <span className="font-medium">{restaurant.phoneNumber}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Email:</span>
                      <span className="font-normal text-gray-600">{restaurant.email}</span>
                    </p>
                  </div>
                  {/* Buttons */}
                  <div className="mt-6 flex justify-between">
                    <button onClick={() => handleApproval(restaurant, "Approved")} className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg">
                      <FaCheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleApproval(restaurant, "Not Approved")} className="flex-1 px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2 shadow-lg mx-2">
                      <FaTimesCircle size={14} /> Reject
                    </button>
               

                    <button onClick={() => handleDelete(restaurant._id, restaurant.email)} className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-lg">
                      <FaTrash size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {activeSection === "analytics" && (
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-3xl font-bold text-[#7F5539] mb-4">Analytics Overview</h2>
          <p className="text-lg text-gray-700">Track performance and insights...</p>
        </div>
      )}
      {activeSection === "feedback" && (
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-3xl font-bold text-[#7F5539] mb-4">User Feedback</h2>
          <p className="text-lg text-gray-700">Review and respond to user feedback...</p>
        </div>
      )}
      {activeSection === "delivery" && (
        <div className="w-full max-w-6xl p-6">
          <h2 className="text-3xl font-bold text-[#7F5539] text-center mb-6 uppercase tracking-wide relative">
            <span className="px-4 py-1 bg-[#E1C699] rounded-lg shadow-md"> Delivery Persons </span>
          </h2>
          {deliveryPersons.length === 0 ? (
            <p className="text-gray-500 p-6 text-lg text-center">No delivery persons registered.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {deliveryPersons.map((person) => (
                <div key={person._id} className="relative bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-gray-300 hover:shadow-3xl transition-transform transform hover:-translate-y-2 flex flex-col">
                  {/* Status Badge */}
                  <div className={`absolute top-4 right-4 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md ${person.status === "Approved" ? "bg-green-500" : person.status === "Rejected" ? "bg-red-500" : "bg-yellow-500"}`}>
                    {person.status}
                  </div>
                  {/* Delivery Person Details */}
                  <h2 className="text-2xl font-bold text-[#7F5539] mb-3 text-center">{person.name}</h2>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Email:</span>
                      <span className="font-medium">{person.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Phone:</span>
                      <span className="font-medium">{person.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">Location:</span>
                      <span className="font-medium">{person.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold">City:</span>
                      <span className="font-medium">{person.city}</span>
                    </p>
                  </div>
                  {/* Document Links */}
                  <div className="mt-4 space-y-2">
                    <p className="font-bold">Documents:</p>
                    <div className="flex space-x-4">
                      <a href={`http://localhost:3000/${person.aadharImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        View Aadhar
                      </a>
                      <a href={`http://localhost:3000/${person.drivingLicenseImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                        View License
                      </a>
                    </div>
                  </div>
                  {/* Buttons */}
                  

                  <div className="mt-6 flex justify-between">
                    <button onClick={() => handleDeliveryApproval(person._id, "Approved")} className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg">
                      <FaCheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleDeliveryApproval(person._id, "Rejected")} className="flex-1 px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center justify-center gap-2 shadow-lg mx-2">
                      <FaTimesCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>

);
};

export default AdminDashboard;

