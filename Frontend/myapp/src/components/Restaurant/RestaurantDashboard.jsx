// RestaurantDashboard.js
import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBars,
  FaCommentDots,
  FaCheck,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddItem from "./Add-item";
import Feedback from "./Feedback";

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("viewItems");

  useEffect(() => {
    const storedRestaurant = localStorage.getItem("restaurantData");

    if (!storedRestaurant) {
      console.error("Restaurant data not found. Redirecting to login...");
      navigate("/restaurant-login");
      return;
    }

    try {
      const parsedRestaurant = JSON.parse(storedRestaurant);
      if (!parsedRestaurant.restaurantID) {
        console.error("Invalid restaurant data. Redirecting to login...");
        navigate("/restaurant-login");
        return;
      }

      setRestaurant(parsedRestaurant);
    } catch (error) {
      console.error("Error parsing restaurant data:", error);
      navigate("/restaurant-login");
    }
  }, [navigate]);

  const fetchFoodItems = async (restaurantId) => {
    if (!restaurantId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/food/${restaurantId}`
      );
      setFoodItems(response.data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  const refreshFoodItems = () => {
    if (restaurant && restaurant.restaurantID) {
      fetchFoodItems(restaurant.restaurantID);
    }
  };

  useEffect(() => {
    if (restaurant && restaurant.restaurantID) {
      fetchFoodItems(restaurant.restaurantID);
    }
  }, [restaurant, navigate]);

  const handleDelete = async (foodId) => {
    try {
      await axios.delete(`http://localhost:3000/api/food/delete/${foodId}`);
      setFoodItems(foodItems.filter((item) => item._id !== foodId));
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurantData");
    navigate("/restaurant-login");
  };

  const handleUpdate = async (foodId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/food/update/${foodId}`,
        updatedData
      );

      setFoodItems((prevItems) =>
        prevItems.map((item) =>
          item._id === foodId
            ? {
                ...item,
                ...updatedData,
                discountPrice:
                  updatedData.discount > 0
                    ? Number(
                        (
                          updatedData.price -
                          (updatedData.price * updatedData.discount) / 100
                        ).toFixed(2)
                      )
                    : updatedData.price,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className={`bg-[#8A4F7D] text-white h-screen p-5 transition-all flex flex-col ${
          sidebarOpen ? "w-56" : "w-16"
        }`}
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-xl font-bold transition-all ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            {restaurant?.restaurantName || "Restaurant"}
          </h2>
          <FaBars
            className="text-white text-2xl cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {sidebarOpen && (
          <nav className="flex flex-col flex-grow justify-center items-center space-y-4">
            <button
              className={`flex items-center space-x-3 w-full py-3 px-4 rounded-md transition ${
                activePage === "viewItems"
                  ? "bg-[#6B3A63]"
                  : "hover:bg-[#6B3A63]"
              }`}
              onClick={() => setActivePage("viewItems")}
            >
              <FaEye className="text-xl" />
              <span>View Items</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full py-3 px-4 rounded-md transition ${
                activePage === "addItem"
                  ? "bg-[#6B3A63]"
                  : "hover:bg-[#6B3A63]"
              }`}
              onClick={() => setActivePage("addItem")}
            >
              <FaPlus className="text-xl" />
              <span>Create Item</span>
            </button>

            <button
              className={`flex items-center space-x-3 w-full py-3 px-4 rounded-md transition ${
                activePage === "feedback"
                  ? "bg-[#6B3A63]"
                  : "hover:bg-[#6B3A63]"
              }`}
              onClick={() => setActivePage("feedback")}
            >
              <FaCommentDots className="text-xl" />
              <span>Feedback</span>
            </button>
          </nav>
        )}
      </div>

      <div className="flex-1 bg-gray-100 relative">
        <nav className="bg-[#8A4F7D] p-4 flex justify-between items-center shadow-lg relative">
          <h1 className="text-white text-2xl font-extrabold tracking-wide uppercase">
            Restaurant Dashboard
          </h1>
          {restaurant && (
            <div className="relative">
              <FaUserCircle
                className="text-white text-4xl cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => setIsOpen(!isOpen)}
              />
              {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl p-5 border border-gray-200 z-50">
                  <h2 className="text-xl font-semibold text-[#8A4F7D] text-center border-b pb-2">
                    {restaurant.restaurantName}
                  </h2>
                  <div className="mt-3 space-y-2 text-gray-800">
                    <p className="flex justify-between">
                      <span className="font-semibold">Owner:</span>{" "}
                      {restaurant.ownerName}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Location:</span>{" "}
                      {restaurant.location}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Email:</span>{" "}
                      {restaurant.email}
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Phone:</span>{" "}
                      {restaurant.phoneNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <div
          className="p-6"
          style={{ height: "calc(100vh - 80px)", overflowY: "auto" }}
        >
          {activePage === "viewItems" && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Your Food Items
              </h2>
              {foodItems.length === 0 ? (
                <p className="text-gray-600 mt-2">No food items added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                  {foodItems.map((item) => (
                    <FoodCard
                      key={item._id}
                      item={item}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {activePage === "addItem" && (
            <AddItem onFoodItemAdded={refreshFoodItems} />
          )}
          {activePage === "feedback" && <Feedback />}
        </div>
      </div>
    </div>
  );
}

const FoodCard = ({ item, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(item.price);
  const [editedAvailability, setEditedAvailability] = useState(
    item.availability
  );
  const [editedDiscount, setEditedDiscount] = useState(item.discount || 0);

  const discountedPrice = editedPrice - (editedPrice * editedDiscount) / 100;

  const saveChanges = () => {
    const updatedData = {
      price: editedPrice,
      discount: editedDiscount,
      availability: editedAvailability,
    };

    onUpdate(item._id, updatedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-3 border border-gray-200 w-64 relative">
      {item.discount > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
          {item.discount}% OFF
        </div>
      )}

      <img
        src={`http://localhost:3000${item.image}`}
        alt={item.name}
        className="w -full h-28 object-cover rounded-lg"
      />

      <h3 className="text-lg font-semibold mt-2 text-gray-800 truncate">
        {item.name}
      </h3>
      <p className="text-sm text-gray-500">{item.category}</p>

      <div className="mt-2 flex justify-between items-center">
        {isEditing ? (
          <div className="flex flex-col space-y-2 w-full">
            <input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              className="w-full border border-gray-300 p-1 rounded text-sm"
              placeholder="Price (₹)"
            />

            <input
              type="number"
              value={editedDiscount}
              onChange={(e) => setEditedDiscount(e.target.value)}
              className="w-full border border-gray-300 p-1 rounded text-sm"
              placeholder="Discount %"
            />

            <select
              value={editedAvailability}
              onChange={(e) => setEditedAvailability(e.target.value)}
              className="w-full border border-gray-300 p-1 rounded text-sm"
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              {item.discount > 0 ? (
                <>
                  <p className="text-gray-500 line-through text-sm">
                    ₹{item.price}
                  </p>
                  <p className="font-semibold text-green-600 text-base">
                    ₹{item.discountPrice.toFixed(2)}
                  </p>
                </>
              ) : (
                <p className="font-semibold text-gray-700 text-base">
                  ₹{item.price}
                </p>
              )}
            </div>

            <p
              className={`font-semibold text-sm ${
                item.availability === "Available"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {item.availability}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-3 space-x-1">
        <button
          className={`${
            isEditing ? "bg-green-500" : "bg-blue-500"
          } text-white text-xs px-2 py-1 rounded-md flex items-center`}
          onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
        >
          {isEditing ? <FaCheck className="mr-1" /> : <FaEdit className="mr-1" />}
          {isEditing ? "Save" : "Edit"}
        </button>

        {isEditing && (
          <button
            className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md flex items-center"
            onClick={() => setIsEditing(false)}
          >
            <FaTimes />
          </button>
        )}

        <button
          className="bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center"
          onClick={() => onDelete(item._id)}
        >
          <FaTrash className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};





