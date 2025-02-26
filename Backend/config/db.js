const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_LINK, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Failed: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDb;
