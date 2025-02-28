const express = require("express");
const RestaurantRegister = require("../models/RestaurantRegister");
const RestaurantCredential = require("../models/RestaurantCredential");
const router = express.Router();
const nodemailer = require("nodemailer"); // Add this at the top



// Generate random Restaurant ID
const generateRandomID = () => `RES${Math.floor(100000 + Math.random() * 900000)}`;

// Generate random password
const generateRandomPassword = () => Math.random().toString(36).slice(-8);

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: 'sanjudddd400@gmail.com',
    pass: 'mhyk twkc iisc tupi'
    },
});

// ✅ Approve or Reject a restaurant (Modified with Email Feature)
router.post("/approve", async (req, res) => {
    const { restaurant, status } = req.body;
    try {
        let newRestaurantData = { ...restaurant, status };
        let emailSubject = "";
        let emailBody = "";

        if (status === "Approved") {
            newRestaurantData.restaurantID = generateRandomID();
            newRestaurantData.password = generateRandomPassword();

            emailSubject = "Restaurant Approval Notification";
            emailBody = `
                <h3>Congratulations!</h3>
                <p>Your restaurant <b>${restaurant.restaurantName}</b> has been approved.</p>
                <p><b>Restaurant ID:</b> ${newRestaurantData.restaurantID}</p>
                <p><b>Password:</b> ${newRestaurantData.password}</p>
                <p>You can now log in and manage your restaurant.</p>
                <p>Thank you!</p>
            `;
        } else {
            emailSubject = "Restaurant Approval Status";
            emailBody = `
                <h3>Restaurant Not Approved</h3>
                <p>Unfortunately, your restaurant <b>${restaurant.restaurantName}</b> has not been approved.</p>
                <p>Please contact support for more details.</p>
                <p>Thank you!</p>
            `;
        }

        console.log("🚀 Saving to RestaurantCredential:", newRestaurantData);

        const newRestaurant = new RestaurantCredential(newRestaurantData);
        await newRestaurant.save();

        console.log("✅ Successfully Saved!");

        // Remove from pending approvals
        await RestaurantRegister.findByIdAndDelete(restaurant._id);

        // Send Email Notification
        await transporter.sendMail({
            from: '"Admin" <admin@gmail.com>',
            to: restaurant.email,
            subject: emailSubject,
            html: emailBody,
        });

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

// ✅ Login Route (Add this below your existing routes)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const restaurant = await RestaurantCredential.findOne({ email });

        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        if (restaurant.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        res.json({ message: "Login successful", restaurantID: restaurant.restaurantID });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
