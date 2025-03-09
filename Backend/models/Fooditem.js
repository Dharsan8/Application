const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    availability: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
    vegNonVeg: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    customization: { type: String, default: "" },
    prepTime: { type: String, required: true },
    image: { type: String, required: true }, // Image path
    restaurantId: { type: String, required: true }, // ✅ Changed ObjectId → String
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", FoodItemSchema);
