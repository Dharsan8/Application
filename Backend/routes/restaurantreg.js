const express = require('express');
const RestaurantRegister = require('../models/RestaurantRegister');
const router = express.Router();

// Store restaurant details
router.post('/register', async (req, res) => {
    console.log("Received registration request:", req.body);
    try {
        const newRestaurant = new RestaurantRegister(req.body);
        await newRestaurant.save();
        res.status(201).json({ message: 'Restaurant registered successfully', data: newRestaurant });
    } catch (error) {
        console.error("Error saving restaurant:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
