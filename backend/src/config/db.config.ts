import mongoose from "mongoose";
import { MONGO_URI } from "./env.config";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Connected to DB:", conn.connection.host);
  } catch (error) {
    console.log("Could not connect to database", error);
    process.exit(1);
  }
};
