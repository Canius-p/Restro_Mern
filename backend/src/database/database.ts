import mongoose from "mongoose";
require("dotenv").config();

const connectDatabase = async (uri: string) => {
  await mongoose.connect(uri);
  console.log("database connected successfully");
};

export { connectDatabase };
