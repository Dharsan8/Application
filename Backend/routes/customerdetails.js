const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const router = express.Router();

// Register a new customer
router.post("/register", async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
  
      // Check if customer already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create and save new customer
      const newCustomer = new Customer({ name, email, password, phone });
      await newCustomer.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
});

// Login Customer
router.post("/login", async (req, res) => {
  try {
    console.log("Received Login Data:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, customer.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_KEY, { expiresIn: "1h" });

    res.json({ token, customer: { id: customer._id, name: customer.name, email: customer.email } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
