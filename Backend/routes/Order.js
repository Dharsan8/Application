const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Delivery = require("../models/Delivery"); // Make sure to import Delivery model

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
router.get("/restaurant/:restaurantId", async (req, res) => {
  try {
    const orders = await Order.find({ 
      $or: [
        { "restaurant._id": req.params.restaurantId },
        { "restaurant.id": req.params.restaurantId }
      ]
    }).sort({ orderDate: -1 });
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this restaurant" });
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching orders",
      error: error.message 
    });
  }
});

// Get orders for delivery person WITH CITY FILTERING
router.get("/delivery/:deliveryPersonId", async (req, res) => {
  try {
    const deliveryPerson = await Delivery.findById(req.params.deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    const orders = await Order.find({
      $or: [
        { 
          status: "Ready",
          $or: [
            { 
              "deliveryAddress": { 
                $regex: new RegExp(deliveryPerson.city, "i") 
              } 
            },
            { 
              "customer.location": { 
                $regex: new RegExp(deliveryPerson.city, "i") 
              } 
            }
          ]
        },
        { 
          deliveryPersonId: req.params.deliveryPersonId,
          status: { $ne: "Delivered" }
        }
      ]
    }).sort({ orderDate: -1 });

    // Additional client-side filtering as fallback
    const filteredOrders = orders.filter(order => {
      const address = order.deliveryAddress || order.customer.location || "";
      return address.toLowerCase().includes(deliveryPerson.city.toLowerCase());
    });

    res.json(filteredOrders);
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

// Update order status
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
    const { deliveryPersonId, deliveryPersonCity } = req.body;
    
    // Verify the order is in the same city
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const address = order.deliveryAddress || order.customer.location || "";
    if (!address.toLowerCase().includes(deliveryPersonCity.toLowerCase())) {
      return res.status(400).json({ message: "Order is not in your delivery area" });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
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
    
    res.json(updatedOrder);
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

module.exports = router;