const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Restaurant = require("../models/Restaurant");

dotenv.config();
const router = express.Router();

// 📌 Restaurant Signup Route (With Default Status: "Pending")
router.post("/restaurants", async (req, res) => {
  try {
    const { name, email, password, phone, address, cuisine } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurant = new Restaurant({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      cuisine,
      status: "Pending", // ✅ New restaurants default to "Pending"
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant registered successfully. Awaiting approval." });
  } catch (error) {
    res.status(500).json({ message: "Error registering restaurant", error });
  }
});

// 📌 Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_KEY, { expiresIn: "1h" });

    return res.json({ message: "Admin login successful", token });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
});

// ✅ Middleware: Admin Authentication Check
const verifyAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  
  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// 📌 Admin: Approve/Reject Restaurant
router.put("/restaurants/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Not Approved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({ message: `Restaurant ${status.toLowerCase()}`, updatedRestaurant });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

// 📌 Admin: Delete Restaurant
router.delete("/restaurants/:id", verifyAdmin, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant", error });
  }
});

module.exports = router;
