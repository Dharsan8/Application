const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// 📌 Restaurant Signup Route (With Default Status: "Pending")

// 📌 Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
      const token = jwt.sign(
        { 
          email: process.env.ADMIN_EMAIL,
          role: "admin" 
        }, 
        process.env.JWT_KEY, 
        { expiresIn: "1h" }
      );

      return res.status(200).json({ 
        success: true,
        message: "Admin login successful", 
        token,
        admin: {
          email: process.env.ADMIN_EMAIL,
          role: "admin"
        }
      });
    }

    res.status(401).json({ 
      success: false,
      message: "Invalid admin credentials" 
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});


module.exports = router;
