import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: [true, "User Email is required"],
    unique: true,
  },
  userName: {
    type: String,
    required: [true, "User Name is required"],
  },
  userPhone: {
    type: Number,
    required: [true, "User Phone is required"],
  },
  userPassword: {
    type: String,
    required: [true, "User Password is required"],
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export { User };
