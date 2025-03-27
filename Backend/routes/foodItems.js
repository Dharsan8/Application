const express = require("express");
const router = express.Router();
const FoodItem = require("../models/Fooditem");
router.get("/:restaurantId", async (req, res) => {
    try {
      const { restaurantId } = req.params;
      console.log("Restaurant backend ID received:", restaurantId);  // ✅ Debug log

      const foodItems = await FoodItem.find({ restaurantId });

      if (!foodItems.length) {
        return res.status(404).json({ message: "No food items found for this restaurant" });
      }

      res.json(foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});


  module.exports = router;