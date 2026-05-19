import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("FATAL: MONGO_URI environment variable is not set.");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    throw new Error(`MongoDB Connection Error: ${error.message}`);
  }
};

export default connectDB;
