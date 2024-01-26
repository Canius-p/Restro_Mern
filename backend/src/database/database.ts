import mongoose from "mongoose";
import { User } from "../models/userModels";

require("dotenv").config();

const connectDatabase = async (uri: string) => {
  await mongoose.connect(uri);
  console.log("database connected successfully");

  //check if ther is admin
  const isAdminExists = await User.find({ userEmail: "admin@gmail.com" });
  if (!isAdminExists) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: "password",
      userPhone: "9869358154",
      userName: "admin",
      userRole: "admin",
    });
    console.log("Admin seeded successfylly");
  } else {
    console.log("admin is there");
  }
};
export { connectDatabase };
