const express = require("express");
const router = express.Router();
const FoodItem = require("../models/Fooditem");
const RestaurantCredential = require("../models/RestaurantCredential");

// Search food items by location or restaurant name
router.get("/", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Search query is required!" });
        }

        // Find restaurants that match the search query
        const restaurants = await RestaurantCredential.find({
            $or: [
                { restaurantName: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
            ],
        });

        if (restaurants.length === 0) {
            return res.json([]); // No restaurants found
        }

        // Extract restaurant IDs
        const restaurantIds = restaurants.map((restaurant) => restaurant.restaurantID);

        // Find food items from these restaurants
        const foodItems = await FoodItem.find({ restaurantId: { $in: restaurantIds } });

        res.json(foodItems);
    } catch (error) {
        console.error("Error in search:", error);
        res.status(500).json({ error: "Server error! Please try again." });
    }
});

module.exports = router;
