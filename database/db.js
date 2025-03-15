const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connection Successfull.");
        
    } catch (error) {
        console.log("Error DB Connection !", error);
        
    }
}

module.exports = connectDB;