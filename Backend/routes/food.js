const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const FoodItem = require("../models/Fooditem");
const RestaurantCredential = require("../models/RestaurantCredential"); // ✅ Correct Model

// Set up Multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/image/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// POST route to add a food item
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, description, availability, vegNonVeg, customization, prepTime, restaurantId } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required!" });
    }

    // ✅ Validate restaurantId from `restaurantcredential`
    const restaurantExists = await RestaurantCredential.findOne({ restaurantID: restaurantId });
    if (!restaurantExists) {
      return res.status(404).json({ error: "Restaurant ID not found in restaurantcredential!" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image upload failed!" });
    }

    const newFood = new FoodItem({
      name,
      category,
      price,
      description,
      availability,
      vegNonVeg,
      customization,
      prepTime,
      restaurantId, // ✅ Keep as String
      image: `/image/${req.file.filename}`,
    });

    await newFood.save();
    res.status(201).json({ message: "Food item added successfully!", food: newFood });

  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ error: "Server error! Please try again." });
  }
});

router.get("/:restaurantId", async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurantId: req.params.restaurantId });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});
router.delete("/delete/:foodId", async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.foodId);
    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete food item" });
  }
});


module.exports = router;
