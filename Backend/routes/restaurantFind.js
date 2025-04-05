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

router.patch("/restaurants/:id/resstatus", async (req, res) => {
    try {
      const { id } = req.params;
      const { isOpen } = req.body;
  
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        id,
        { isOpen },
        { new: true }
      );
  
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      res.status(200).json({
        message: `Restaurant status updated to ${isOpen ? "Open" : "Closed"}`,
        restaurant: updatedRestaurant,
      });
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
