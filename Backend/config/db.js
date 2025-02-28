const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDb = async () => {
    try {
        const mongoDB = await mongoose.connect(process.env.MONGO_LINK);
        console.log(`MongoDB Connected: ${mongoDB.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDb;
