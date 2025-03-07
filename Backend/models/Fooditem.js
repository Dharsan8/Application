const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  offer: { type: String, default: "No Offer" },
  price: { type: Number, required: true },
  cuisineType: { type: String, enum: ["South Indian", "North Indian"], required: true },
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
});

const FoodItem = mongoose.model("FoodItem", FoodItemSchema);
module.exports = FoodItem;
