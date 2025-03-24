const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

const router = express.Router();

// Register a new customer
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    customer = new Customer({ name, email, password: hashedPassword, phone });
    await customer.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login Customer
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: "Invalid credentials" });

    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", customer.password);

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: customer._id }, process.env.JWT_KEY, { expiresIn: "1h" });

    res.json({ token, customer: { id: customer._id, name: customer.name, email: customer.email } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
