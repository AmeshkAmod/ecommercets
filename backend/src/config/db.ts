import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error: unknown) {
    console.error("MongoDB Connection Error", error);
    process.exit(1);
  }
};

export default connectDB;
