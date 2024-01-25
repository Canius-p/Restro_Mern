require("dotenv").config({ path: "./.env" });

import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const port = process.env.PORT;
import morgan from "morgan";
import fs from "fs";
import path from "path";

import { connectDatabase } from "./database/database";

//connecing database
connectDatabase(process.env.MONGO_URI!);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes here
const authRoute = require("./routes/authRoute");
//erroer logger path
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./log/access.log"),
  { flags: "a" }
);
app.use(
  morgan(
    `:date[web] :method :url :status :response-time ms - :res[content-length]`,
    { stream: accessLogStream }
  )
);
//testing api
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});

// apiendpoints
app.use("/api", authRoute);

app.listen(port, () => {
  console.log(`Server is running on port http://127.0.0.1:${port}`);
});
