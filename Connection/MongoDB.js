import mongoose from "mongoose"; // Import the mongoose package

export const connectToDatabase = async () => {
  // Function to connect to the MongoDB database
  try {
    const db = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    return false;
  }
};

