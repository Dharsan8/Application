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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-[#AD56C4] text-white font-bold rounded-xl hover:bg-[#FF8DA1] transition"
      >
        View Restaurants
      </button>

      {/* Popup Modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-lg">
            <Dialog.Title className="text-2xl font-bold text-gray-800">Registered Restaurants</Dialog.Title>

            <div className="mt-4 max-h-[400px] overflow-auto">
              {restaurants.length === 0 ? (
                <p className="text-gray-500">No registered restaurants found.</p>
              ) : (
                restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="p-3 border-b">
                    <h2 className="text-lg font-semibold">{restaurant.restaurantName}</h2>
                    <p className="text-sm text-gray-600">Location: {restaurant.location}</p>
                    <p className="text-sm text-gray-600">Owner: {restaurant.ownerName}</p>
                    <p className="text-sm text-gray-600">Contact: {restaurant.phoneNumber}</p>
                    <p className="text-sm text-gray-600">Address: {restaurant.address}</p>
                    <p className="text-sm text-gray-600">Email: {restaurant.email}</p>
                    <p className="text-sm text-gray-600">Status: Not Approved</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleApproval(restaurant, "Approved")}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(restaurant, "Not Approved")}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                      >
                        Not Approved
                      </button>
                      <button
                        onClick={() => handleDelete(restaurant._id, restaurant.email)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-xl w-full"
            >
              Close
            </button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminDashboard;
