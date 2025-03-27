const express = require("express");
const router = express.Router();
const Restaurant = require("../models/RestaurantCredential");

// GET only approved restaurants
router.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ status: "Approved" }); // Fetch only approved restaurants
        res.json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Server error while fetching restaurants" });
    }
});

module.exports = router;
