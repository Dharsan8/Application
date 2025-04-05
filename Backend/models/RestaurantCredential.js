const mongoose = require("mongoose");

const RestaurantCredentialSchema = new mongoose.Schema({
  restaurantID: String,  // ✅ Add this
  password: String,  // ✅ Add this
  restaurantName: String,
  location: String,
  ownerName: String,
  phoneNumber: String,
  address: String,
  email: String,
  restaurantImage: { type: String, default: "/uploads/default-image.jpg" }, // ✅ Added default value
  status: String, // "Approved", "Not Approved", "Deleted"
  isOpen: {
    type: Boolean,
    default: false, // By default, restaurant is closed
  }
});

const RestaurantCredential = mongoose.model("RestaurantCredential", RestaurantCredentialSchema);

module.exports = RestaurantCredential;
