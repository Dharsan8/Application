const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String, required: true }
  },
  restaurant: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    image: { type: String }
  }],
  subtotal: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: { type: Date, default: Date.now },
  deliveryAddress: { type: String },
  specialInstructions: { type: String }
});

module.exports = mongoose.model("Order", OrderSchema);