require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth")


const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"] 
}));

connectDb(); // Mongodb Function Call
app.use("/api",authRoutes);
app.get('/api/protected',authMiddleware,(req,res)=>{
    res.json({message:"protected route",user:req.user});
});

const Port = process.env.PORT || 5000;
app.listen(Port,()=> console.log(`Server is started Runing at ${Port}`));