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
    enum: ["Pending", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"],
    default: "Pending",
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    message: { type: String }
  }],
  orderDate: { type: Date, default: Date.now },
  deliveryAddress: { type: String, required: true },
  specialInstructions: { type: String },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Delivery",
  }
  
});

// Add status to history when order is created
OrderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusHistory = [{
      status: 'Pending',
      message: 'Order has been placed and is awaiting confirmation'
    }];
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);