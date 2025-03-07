import { useState, useEffect } from "react";
import axios from "axios";
import { FaChartPie, FaStore, FaComments, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaTrash, } from "react-icons/fa";


const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard");

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
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
      const response = await axios.post("http://localhost:3000/api/restaurants/approve", {
        restaurant,
        status,
      });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-[#8A4F7D] text-white flex flex-col items-center py-6 shadow-xl rounded-r-2xl relative">
        <h2 className="text-lg font-bold mb-6">Foodie</h2>
        <div className="flex-1 flex flex-col justify-center gap-6">
          <button
            onClick={() => setActiveSection("restaurants")}
            className="p-3 rounded-full hover:bg-[#7F5539] transition relative group"
          >
            <FaStore size={22} />
            <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition">
              Approvals
            </span>
          </button>
          <button
            onClick={() => setActiveSection("analytics")}
            className="p-3 rounded-full hover:bg-[#7F5539] transition relative group"
          >
            <FaChartPie size={22} />
            <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition">
              Analytics
            </span>
          </button>
          <button
            onClick={() => setActiveSection("feedback")}
            className="p-3 rounded-full hover:bg-[#7F5539] transition relative group"
          >
            <FaComments size={22} />
            <span className="absolute left-14 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition">
              Feedback
            </span>
          </button>
        </div>
        <button className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition">
          <FaSignOutAlt size={22} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="bg-[#8A4F7D] text-white text-center p-6 rounded-xl shadow-xl w-full mb-8">
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
        </div>

        {/* Section Rendering */}
        <div className="flex-1">
          {activeSection === "restaurants" && (
            <div className="w-full max-w-6xl p-6 bg-[#E1C699] rounded-xl shadow-xl transition-opacity duration-300 animate-fadeIn">
            <h2 className="text-3xl font-bold text-[#7F5539] mb-6 text-center">Registered Restaurants</h2>
            
            {restaurants.length === 0 ? (
              <p className="text-gray-500 p-6 text-lg text-center">No registered restaurants found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="bg-white shadow-lg rounded-xl p-6 transform hover:scale-105 transition duration-300">
                    <h2 className="text-xl font-semibold text-[#7F5539] mb-2">{restaurant.restaurantName}</h2>
                    <p className="text-md font-bold text-[#7F5539]">Location: <span className="font-normal text-[#9C6644]">{restaurant.location}</span></p>
                    <p className="text-md font-bold text-[#7F5539]">Owner: <span className="font-normal text-[#9C6644]">{restaurant.ownerName}</span></p>
                    <p className="text-md font-bold text-[#7F5539]">Contact: <span className="font-normal text-[#9C6644]">{restaurant.phoneNumber}</span></p>
                    <p className="text-md font-bold text-[#7F5539]">Email: <span className="font-normal text-[#9C6644]">{restaurant.email}</span></p>
                    <p className="text-sm font-semibold text-[#B08968] mt-2">Status: Not Approved</p>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApproval(restaurant, "Approved")}
                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                      >
                        <FaCheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleApproval(restaurant, "Not Approved")}
                        className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
                      >
                        <FaTimesCircle size={16} /> Reject
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant._id, restaurant.email)}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                      >
                        <FaTrash size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>          
          )}

          {activeSection === "analytics" && (
            <div className="p-6 bg-[#E1C699] rounded-xl shadow-xl">
              <h2 className="text-3xl font-bold text-[#7F5539] mb-4">Analytics Overview</h2>
              <p className="text-lg text-gray-700">Track performance and insights...</p>
            </div>
          )}

          {activeSection === "feedback" && (
            <div className="p-6 bg-[#E1C699] rounded-xl shadow-xl">
              <h2 className="text-3xl font-bold text-[#7F5539] mb-4">User Feedback</h2>
              <p className="text-lg text-gray-700">Review and respond to user feedback...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
