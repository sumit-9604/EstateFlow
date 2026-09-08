const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the URI from your .env file [cite: 96, 97]
        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;