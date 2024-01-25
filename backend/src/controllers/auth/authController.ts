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
  const userExit = await User.find({ userEmail: email });
  if (userExit.length == 0) {
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
