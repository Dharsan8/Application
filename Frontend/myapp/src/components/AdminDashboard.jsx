import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetch restaurant details
  useEffect(() => {
    axios.get("http://localhost:3000/api/restaurants")
      .then((response) => setRestaurants(response.data))
      .catch((error) => console.error("Error fetching restaurants:", error));
  }, []);

  // Update approval status
  const handleApproval = async (id, status) => {
    try {
      await axios.put(`http://localhost:3000/api/restaurants/${id}`, { status });
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant._id === id ? { ...restaurant, status } : restaurant
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete restaurant
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`http://localhost:3000/api/restaurants/${id}`);
        setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id));
      } catch (error) {
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // ✅ Remove Token on Logout
    navigate("/admin-login"); // ✅ Redirect to Login
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Admin Dashboard
      </h1>

      {/* Logout Button */}
      <div className="text-right mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
        >
          Logout
        </button>
      </div>

      {/* Restaurant Management Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Cuisine</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id} className="border-b dark:border-gray-700">
                <td className="p-4">{restaurant.name}</td>
                <td className="p-4">{restaurant.email}</td>
                <td className="p-4">{restaurant.phone}</td>
                <td className="p-4">{restaurant.cuisine}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-white ${
                    restaurant.status === "Approved" ? "bg-green-500" : 
                    restaurant.status === "Not Approved" ? "bg-red-500" : 
                    "bg-yellow-500"
                  }`}>
                    {restaurant.status}
                  </span>
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => handleApproval(restaurant._id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(restaurant._id, "Not Approved")}
                    className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Not Approve
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {restaurants.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No restaurants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
