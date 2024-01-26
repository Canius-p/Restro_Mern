import { User } from "../../models/userModels";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../services/sendEmail";
//register user api
export const registerUser = async (req: Request, res: Response) => {
  const { name, phone, email, password } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  await User.create({
    userName: name,
    userEmail: email,
    userPassword: bcrypt.hashSync(password, 6),
    userPhone: phone,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
};

//loginuser api
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  //check if eamil exists or not
  const userFound = await User.find({ userEmail: email });
  if (userFound.length == 0) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const isMatch = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatch) {
    const token = jwt.sign({ _id: userFound[0]._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }

  return res.status(400).json({
    message: "Invalid credentials",
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Email is required",
    });
  }
  //check if user exist with email or not
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  function generateOTP() {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let OTP = Array.from(
      { length: 6 },
      () => digits[Math.floor(Math.random() * digits.length)]
    ).join("");
    return OTP;
  }
  const otp = generateOTP();

  //send otp
  userExist[0].otp = undefined;
  userExist[0].isVerified = true;
  await userExist[0].save();
  await sendEmail({
    email: email,
    subject: "Password Reset",
    message: `Your OTP is ${otp}`,
  });
  return res.status(200).json({
    message: "Password reset link sent to your email",
    otp,
  });
};

//verify otp
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "please provide email and otp",
    });
  }
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User is not registered",
    });
  }
  if (userExist[0].otp != otp) {
    return res.status(400).json({
      message: "Invalid otp",
    });
  }
  res.status(200).json({
    message: "Otp verified",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "People provide eamil,new password and confirm password",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "New password doest match with confirm password",
    });
  }
  const userExist = await User.find({ userEmail: email }).select("+isVerified");
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User email is not registered",
    });
  }
  if (userExist[0].isVerified !== true) {
    return res.status(404).json({
      message: "You cannot perform this action",
    });
  }
  userExist[0].userPassword = bcrypt.hashSync(newPassword, 6);
  userExist[0].isVerified = false;
  await userExist[0].save();

  res.status(200).json({
    message: "password changed successfully",
  });
};
