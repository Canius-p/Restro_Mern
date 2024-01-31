import { Product } from "../../models/productModel";
import fs from "fs";
import { Request, Response } from "express";
export const createProduct = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    filePath = "";
  } else {
    filePath = req.file.filename;
  }
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
    productImage: process.env.BACKEND_URL + filepath,
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

    //remove the file
    fs.unlink("/uploads/" + afterCutFIle, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted successfully");
      }
    });

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "product deleted successfully",
    });
  }
};

export const editProducts = async (req: Request, res: Response) => {
  // fs.unlink("./uploads/test.txt", (err) => {
  //   if (err) {
  //     console.log("erroroccures", err);
  //   } else {
  //     console.log("File deleted");
  //   }
  // });
  // return;
  const { id } = req.params;

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
      message:
        "Please Provide ProductName,ProductDescription,ProductPrice,ProductStatus,ProductStockQty",
    });
  }
  const oldData = await Product.findById(id);
  if (!oldData) {
    return res.status(404).json({
      message: "No data found with that id",
    });
  }
  const oldProductImage = oldData.productImage;
  const lengthCut = process.env.BACKEND_URL.length;
  const afterCutFIle = oldProductImage.slice(lengthCut);
  if (req.file && req.file.filename) {
    //remove the file
    fs.unlink("/uploads/" + afterCutFIle, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted successfully");
      }
    });
  }
  await Product.findByIdAndUpdate(
    id,
    {
      productName,
      productDescription,
      productPrice,
      productStockQty,
      productStatus,
      productImage:
        req.file && req.file.filename
          ? process.env.BACKEND_URL + req.file.filename
          : oldProductImage,
    },
    {
      new: true,
      runvalidators: true,
    }
  );
  res.status(200).json({
    message: "product updated successfully",
  });
};
