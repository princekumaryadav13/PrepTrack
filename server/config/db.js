const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri =
            process.env.MONGO_URI && process.env.MONGO_URI.trim() !== ""
                ? process.env.MONGO_URI
                : "mongodb://127.0.0.1:27017/preptrack";

        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        console.warn(
            "💡 Tip: Ensure local MongoDB is running or specify a MongoDB Atlas connection string in server/.env under MONGO_URI."
        );
    }
};

module.exports = connectDB;