import { Product } from "../../models/productModel";
import fs from "fs";
import { Request, Response } from "express";
export const createProduct = async (req: Request, res: Response) => {
  // const file = req.file;
  // if (!file) {
  //   filePath = "";
  // } else {
  //   filePath = req.file.filename;
  // }
  const {
    productName,
    productDescription,
    productPrice,
    productStockQty,
    productStatus,
  } = req.body;

  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productStockQty ||
    !productStatus
  ) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }
  //inserting into db
  await Product.create({
    productName,
    productDescription,
    productPrice,
    productStatus,
    // productImage: process.env.BACKEND_URL + filepath,
  });
  return res.status(200).json({
    message: "Product Create Successfullty",
  });
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const oldData = await Product.findById(id);
  if (!oldData) {
    if (!oldData) {
      return res.status(404).json({
        message: "No data found with that id",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Please povide id",
      });
    }

    //remove the file

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "product deleted successfully",
    });
  }
};
