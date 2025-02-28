const express = require("express");
const RestaurantRegister = require("../models/RestaurantRegister");
const RestaurantCredential = require("../models/RestaurantCredential");
const router = express.Router();

// Generate random Restaurant ID
const generateRandomID = () => `RES${Math.floor(100000 + Math.random() * 900000)}`;

// Generate random password
const generateRandomPassword = () => Math.random().toString(36).slice(-8);

// ✅ Approve or Reject a restaurant
router.post("/approve", async (req, res) => {
    const { restaurant, status } = req.body;
    try {
        let newRestaurantData = { ...restaurant, status };

        if (status === "Approved") {
            newRestaurantData.restaurantID = generateRandomID();
            newRestaurantData.password = generateRandomPassword();
        }

        console.log("🚀 Saving to RestaurantCredential:", newRestaurantData);

        const newRestaurant = new RestaurantCredential(newRestaurantData);
        await newRestaurant.save();

        console.log("✅ Successfully Saved!");

        await RestaurantRegister.findByIdAndDelete(restaurant._id);

        res.json({ message: `Restaurant marked as ${status} successfully!`, data: newRestaurant });
    } catch (error) {
        console.error("❌ Error processing approval:", error);
        res.status(500).json({ error: "Failed to update restaurant status" });
    }
});

// ✅ Register a new restaurant
router.post("/register", async (req, res) => {
    try {
        const newRestaurant = new RestaurantRegister(req.body);
        await newRestaurant.save();
        res.status(201).json({ message: "Restaurant registered successfully", data: newRestaurant });
    } catch (error) {
        console.error("Error saving restaurant:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fetch all registered restaurants
router.get("/all", async (req, res) => {
    try {
        const restaurants = await RestaurantRegister.find();
        res.json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Delete from both restaurantRegisters & restaurantCredentials
router.delete("/delete/:id/:email", async (req, res) => {
    const { id, email } = req.params;
    try {
        await RestaurantRegister.findByIdAndDelete(id);
        await RestaurantCredential.findOneAndDelete({ email });

        res.json({ message: "Restaurant deleted successfully!" });
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        res.status(500).json({ error: "Failed to delete restaurant" });
    }
});

module.exports = router;
