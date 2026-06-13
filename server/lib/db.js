import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ Database Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error.message);
    throw error;
  }
};
