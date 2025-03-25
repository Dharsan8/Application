const mongoose = require("mongoose");

const restaurantRegisterSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, required: true },
    location: { type: String, required: true },
    restaurantNumber: { type: String, required: true },
    ownerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    restaurantImage: { type: String }, // Add this to store image path
  },
  { timestamps: true }
);

module.exports = mongoose.model("RestaurantRegister", restaurantRegisterSchema);
