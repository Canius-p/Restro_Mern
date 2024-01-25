import { User } from "../../models/userModels";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
