// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

// Close the MongoDB connection gracefully using mongoose.disconnect
const closeDB = async () => {
  await mongoose.disconnect();
  console.log('MongoDB connection closed');
};

// Export both functions
module.exports = connectDB;
module.exports.closeDB = closeDB;
