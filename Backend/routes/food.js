const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const FoodItem = require("../models/Fooditem"); // Import Model

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/image/"); // Ensure this path exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file
  },
});

const upload = multer({ storage: storage });

// POST route to add a food item
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, quantity, offer, price, cuisineType, hotelName, location,restaurantId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const newFood = new FoodItem({
      name,
      quantity,
      offer,
      price,
      cuisineType,
      hotelName,
      location,
      restaurantId, // Associate item with restaurant
      image: `/image/${req.file.filename}`, // Store image path
    });

    await newFood.save();
    res.status(201).json({ message: "Food item added successfully!", food: newFood });

  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Server error! Please try again." });
  }
});

module.exports = router;
