const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    offer: { type: String, default: "" },
    price: { type: Number, required: true },
    cuisineType: { type: String, required: true },
    hotelName: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true }, // Image path
}, { timestamps: true });

module.exports = mongoose.model("FoodItem", FoodItemSchema);


