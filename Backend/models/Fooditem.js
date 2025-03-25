const mongoose = require("mongoose");

const FoodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    description: { type: String, required: true },
    availability: { type: String, enum: ["Available", "Out of Stock"], default: "Available" },
    vegNonVeg: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    customization: { type: String, default: "" },
    prepTime: { type: String, required: true },
    image: { type: String, required: true }, // Image path
    restaurantId: { type: String, required: true },
    location: String,        // ✅ Added
  restaurantName: String,  // ✅ Added
    discount: { type: Number, default: 0 } 
  },
  { timestamps: true }
);

FoodItemSchema.pre('save', function (next) {
  if (this.discount > 0) {
      this.discountPrice = this.price - (this.price * this.discount) / 100;
  } else {
      this.discountPrice = 0; // No discount applied
  }
  next();
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
