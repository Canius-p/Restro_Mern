require("dotenv").config({ path: "./.env" });

import express, { Request, Response } from "express";
import morgan from "morgan";
import { connectDatabase } from "./database/database";

import { User } from "./models/userModels";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecing database
connectDatabase(process.env.MONGO_URI!);

//register user api
app.post("/api/register", async (req: Request, res: Response) => {
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
});

//loginuser api
app.post("/api/login", async (req: Request, res: Response) => {
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
});
//testing api
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Server is running on  http://127.0.0.1:${port}`);
});
