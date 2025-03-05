import { useState, useEffect } from "react";
import axios from "axios";
import * as Dialog from "@radix-ui/react-dialog";

const AdminDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col items-center min-h-screen bg-[#F5E1DA] p-6">
    <h1 className="text-3xl font-bold text-[#7F5539] mb-6">Admin Dashboard</h1>

    {/* View Restaurants Button */}
    <button
      onClick={() => setOpen(!open)}
      className="px-6 py-3 bg-[#B08968] text-white font-bold rounded-xl hover:bg-[#9C6644] transition"
    >
      {open ? "Hide Restaurants" : "View Restaurants"}
    </button>

    {/* Approval List (Visible only when open) */}
    {open && (
      <div className="w-full max-w-5xl mt-6 p-6 bg-[#E1C699] rounded-xl shadow-lg transition-opacity duration-300 animate-fadeIn">
        <h2 className="text-2xl font-bold text-[#7F5539] mb-4">Registered Restaurants</h2>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {restaurants.length === 0 ? (
            <p className="text-gray-500 p-4">No registered restaurants found.</p>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                className="flex items-center justify-between border-b p-4 bg-[#F5E1DA]"
              >
                <div>
                  <h2 className="text-lg font-semibold text-[#7F5539]">
                    {restaurant.restaurantName}
                  </h2>
                  <p className="text-sm text-[#9C6644]">Location: {restaurant.location}</p>
                  <p className="text-sm text-[#9C6644]">Owner: {restaurant.ownerName}</p>
                  <p className="text-sm text-[#9C6644]">Contact: {restaurant.phoneNumber}</p>
                  <p className="text-sm text-[#9C6644]">Email: {restaurant.email}</p>
                  <p className="text-sm font-semibold text-[#B08968]">Status: Not Approved</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(restaurant, "Approved")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(restaurant, "Not Approved")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    Not Approved
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant._id, restaurant.email)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )}
  </div>
  );
};

export default AdminDashboard;
