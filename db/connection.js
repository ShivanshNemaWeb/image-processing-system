const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
  try {
    const { MONGODB_URI } = process.env;

    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000
    });

    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`);
  }
};

module.exports = {
  connectDb,
  mongoose,
};
