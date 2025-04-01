const express = require("express");
const router = express.Router();
const Delivery = require("../models/Delivery");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/delivery");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Register new delivery person
router.post("/register", upload.fields([
  { name: "aadharImage", maxCount: 1 },
  { name: "drivingLicenseImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, email, phone, location, city, password } = req.body;
    
    const existingDelivery = await Delivery.findOne({ email });
    if (existingDelivery) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newDelivery = new Delivery({
      name,
      email,
      phone,
      location,
      city,
      password, // In production, hash this password before saving
      aadharImage: req.files["aadharImage"][0].path,
      drivingLicenseImage: req.files["drivingLicenseImage"][0].path,
    });

    await newDelivery.save();
    res.status(201).json({ message: "Registration successful. Waiting for admin approval." });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// Delivery login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const deliveryPerson = await Delivery.findOne({ email });

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    if (deliveryPerson.status !== "Approved") {
      return res.status(403).json({ message: "Your account is not approved yet" });
    }

    // In production, use bcrypt to compare hashed passwords
    if (deliveryPerson.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", deliveryPerson });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get all delivery persons (for admin)
router.get("/", async (req, res) => {
  try {
    const deliveryPersons = await Delivery.find();
    res.json(deliveryPersons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch delivery persons", error: error.message });
  }
});

// Update delivery person status (for admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const deliveryPerson = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    res.json({ message: "Status updated successfully", deliveryPerson });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
});

// In your orders.js router
router.get("/delivery/:deliveryPersonId", async (req, res) => {
  try {
    const deliveryPerson = await Delivery.findById(req.params.deliveryPersonId);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }

    // Find orders that are either:
    // 1. Ready and match the delivery person's city
    // 2. Already assigned to this delivery person
    const orders = await Order.find({
      $or: [
        { 
          status: "Ready",
          $or: [
            { "deliveryAddress": { $regex: deliveryPerson.city, $options: "i" } },
            { "customer.location": { $regex: deliveryPerson.city, $options: "i" } }
          ]
        },
        { 
          deliveryPersonId: req.params.deliveryPersonId,
          status: { $in: ["Out for Delivery", "Delivered"] }
        }
      ]
    }).sort({ orderDate: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Accept delivery endpoint
router.patch("/:id/accept-delivery", async (req, res) => {
  try {
    const { deliveryPersonId, deliveryPersonCity } = req.body;
    
    // Verify the order is still available and matches the delivery person's city
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.status !== "Ready") {
      return res.status(400).json({ message: "Order is no longer available" });
    }
    
    // Check if order matches delivery person's city
    const deliveryAddress = order.deliveryAddress || order.customer.location;
    if (!deliveryAddress.toLowerCase().includes(deliveryPersonCity.toLowerCase())) {
      return res.status(400).json({ message: "Order is not in your delivery area" });
    }
    
    // Update the order
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

// Reject delivery endpoint
router.patch("/:id/reject-delivery", async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    
    // Just confirm the order exists
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    // Add rejection to history but don't change status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          statusHistory: {
            status: order.status,
            message: `Order rejected by delivery person ${deliveryPersonId}`,
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



module.exports = router;