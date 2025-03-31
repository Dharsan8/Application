const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get order history for a user
router.get("/history/:username", async (req, res) => {
  try {
    const orders = await Order.find({ "customer.username": req.params.username })
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order details by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, message } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status },
        $push: {
          statusHistory: {
            status,
            message: message || `Status changed to ${status}`
          }
        }
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;