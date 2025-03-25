const express = require("express");
const router = express.Router();
const RestaurantCredential = require("../models/RestaurantCredential");

// Search restaurants by name or location
router.get("/", async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Search query is required!" });
        }

        // Find restaurants that match the search query
        const restaurants = await RestaurantCredential.find(
            {
                $or: [
                    { restaurantName: { $regex: query, $options: "i" } },
                    { location: { $regex: query, $options: "i" } },
                ],
            },
            "restaurantName restaurantImage" // Return only restaurant name and image
        );

        res.json(restaurants);
    } catch (error) {
        console.error("Error in search:", error);
        res.status(500).json({ error: "Server error! Please try again." });
    }
});

module.exports = router;
