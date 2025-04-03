require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const restaurantRoutes = require("./routes/restaurantreg");
const foodRoutes = require("./routes/food"); // ✅ Import food routes
const path = require("path");
const searchRoutes = require("./routes/search"); // Import search route
const restaurantFind = require("./routes/restaurantFind");
const foodItems = require("./routes/foodItems")
const orderRoutes = require("./routes/Order");
const deliveryRoutes = require("./routes/delivery");
const orderRouting = require("./routes/orderRoutes");



const app = express();
app.use(express.json());
app.use(cors({ 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/image", express.static(path.join(__dirname, "Public/image")));
app.use("/uploads", express.static("uploads"));

app.use("/api/customer", require("./routes/customerdetails"));

// Connect MongoDB
connectDb();


// Routes
app.use("/api", authRoutes);
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: "Protected route", user: req.user });
});

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/food', foodRoutes); // ✅ Use food routes separately
app.use("/search", searchRoutes); // ✅ Add this
app.use("/api", restaurantFind);
app.use("/api/food",foodItems);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRouting);
app.use(foodRoutes);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
