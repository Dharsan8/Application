const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdAt: new Date() // Add creation timestamp
    });
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

// Cancel order (no time limit)
router.patch("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Only check if order is already cancelled or delivered
    if (order.status === "Cancelled") {
      return res.status(400).json({ 
        message: "Order is already cancelled" 
      });
    }
    
    if (order.status === "Delivered") {
      return res.status(400).json({ 
        message: "Delivered orders cannot be cancelled" 
      });
    }
    
    // Update order status to cancelled
    const cancelledOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: "Cancelled" },
        $push: {
          statusHistory: {
            status: "Cancelled",
            message: "Order cancelled by customer",
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(cancelledOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;