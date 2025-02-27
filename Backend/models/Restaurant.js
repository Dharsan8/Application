const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  cuisine: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Not Approved"], default: "Pending" },  // ✅ Add Status Field
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
