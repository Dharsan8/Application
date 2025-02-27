const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Restaurant = require("../models/Restaurant");

dotenv.config();
const router = express.Router();

// 📌 Restaurant Signup Route (With Default Status: "Pending")

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



module.exports = router;
