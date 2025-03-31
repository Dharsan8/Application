const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      createdAt: new Date(),
      status: "Pending"
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get orders for restaurant
// In your orders.js router:
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    console.log("Fetching orders for restaurant:", req.params.restaurantId); // Debug log
    
    const orders = await Order.find({ 
      $or: [
        { "restaurant._id": req.params.restaurantId },
        { "restaurant.id": req.params.restaurantId } // Alternative field name
      ]
    }).sort({ orderDate: -1 });
    
    console.log("Found orders:", orders); // Debug log
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this restaurant" });
    }
    
    res.json(orders);
  } catch (error) {
    console.error("Error in /restaurant/:id route:", error); // Debug log
    res.status(500).json({ 
      message: "Error fetching orders",
      error: error.message 
    });
  }
});
// Get orders for delivery person
router.get("/delivery/:deliveryPersonId", async (req, res) => {
  try {
    const orders = await Order.find({ 
      $or: [
        { deliveryPersonId: req.params.deliveryPersonId },
        { status: "Ready" } // Show ready orders that can be accepted
      ]
    }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Update order status (used by restaurant and delivery)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, deliveryPersonId, message } = req.body;
    
    const updateData = {
      $set: { status },
      $push: {
        statusHistory: {
          status,
          message: message || `Status changed to ${status}`,
          timestamp: new Date()
        }
      }
    };

    if (deliveryPersonId) {
      updateData.$set.deliveryPersonId = deliveryPersonId;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel order
router.patch("/:id/cancel", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
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
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept order for delivery
router.patch("/:id/accept-delivery", async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { 
          status: "Out for Delivery",
          deliveryPersonId 
        },
        $push: {
          statusHistory: {
            status: "Out for Delivery",
            message: `Order accepted by delivery person ${deliveryPersonId}`,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject order by delivery person
router.patch("/:id/reject-delivery", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { 
          deliveryPersonId: null 
        },
        $push: {
          statusHistory: {
            status: "Ready",
            message: "Order rejected by delivery person",
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Temporary test route - remove after debugging
router.get("/all", async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

module.exports = router;