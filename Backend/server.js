require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");
const restaurantRoutes = require("./routes/restaurantreg");

const app = express();
app.use(express.json());
app.use(cors({ 
    origin: '*', // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Connect MongoDB
connectDb();

// Routes
app.use("/api", authRoutes);
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: "Protected route", user: req.user });
});

app.use('/api/restaurants', restaurantRoutes);

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
