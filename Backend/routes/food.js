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
    const { 
      name, category, price, description, availability, vegNonVeg, 
      customization, prepTime, restaurantId, location, restaurantName 
    } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required!" });
    }

    // Validate Restaurant ID
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
      restaurantId,
      location,        // ✅ Save in DB
      restaurantName,  // ✅ Save in DB
      image: `/image/${req.file.filename}`,
      discount: 0
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
// update
router.put("/update/:id", async (req, res) => {
  try {
    const { price, discount, availability } = req.body;

    // Fetch existing item
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) return res.status(404).json({ error: "Food item not found" });

    // Update price if changed
    if (price !== undefined) {
        foodItem.price = price;
    }

    // Update discount and recalculate discountPrice
    if (discount !== undefined) {
        foodItem.discount = discount;
        foodItem.discountPrice = discount > 0 ? foodItem.price - (foodItem.price * discount) / 100 : 0;
    }

    // Update availability
    foodItem.availability = availability || foodItem.availability;

    await foodItem.save();
    res.json({ message: "Food item updated successfully", foodItem });
} catch (error) {
    res.status(500).json({ error: "Internal server error" });
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

router.get("/api/foodItems", async (req, res) => {
  try {
    const { location, restaurantName } = req.query;

    if (!location || !restaurantName) {
      return res.status(400).json({ message: "Missing location or restaurantName" });
    }

    const foodItems = await FoodItem.find({ location, restaurantName });

    if (!foodItems.length) {
      return res.status(404).json({ message: "No food items found" });
    }

    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
