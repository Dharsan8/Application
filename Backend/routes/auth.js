const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Restaurant = require("../models/Restaurant");

dotenv.config();
const router = express.Router();

// 📌 Restaurant Signup Route
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
      });
  
      await newRestaurant.save();
      res.status(201).json({ message: "Restaurant registered successfully" });
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
require("dotenv").config();
module.exports = router;

