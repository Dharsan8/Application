const express = require("express");
const router = express.Router();
const FoodItem = require("../models/Fooditem");


// Fetch all food items for a restaurant
router.get("/:restaurantId", async (req, res) => {
    try {
      const { restaurantId } = req.params;
  
      const foodItems = await FoodItem.find({ restaurantId });
  
      res.json(foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Submit a rating for a specific food item
  router.post("/rate/:foodItemId", async (req, res) => {
    const { foodItemId } = req.params;
    const { userId, rating } = req.body;
  
    try {
      const foodItem = await FoodItem.findById(foodItemId);
  
      if (!foodItem) return res.status(404).json({ message: "Food item not found" });
  
      const existingRating = foodItem.ratings.find(r => r.userId.toString() === userId);
  
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        foodItem.ratings.push({ userId, rating });
      }
  
      // Calculate and update average rating
      const totalRatings = foodItem.ratings.length;
      const averageRating = foodItem.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;
      foodItem.averageRating = parseFloat(averageRating.toFixed(1));
  
      await foodItem.save();
  
      res.json({ message: "Rating submitted successfully", averageRating: foodItem.averageRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
  module.exports = router;