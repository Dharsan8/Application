const mongoose = require('mongoose');

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_LINK)
        console.log("MongoDb is Connected")
    }catch(error){
        console.log("Error in Connecting with MongoDb",error);
        process.exit(1);  // It will the Process with an error
    }
}

module.exports = connectDb;