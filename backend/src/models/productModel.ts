import mongoose from "mongoose";
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    productName: {
      type: String,
      require: [true, "Product Name must be provided"],
    },
    productDescription: {
      type: String,
      require: [true, "Description must be provided"],
    },
    productStockQty: {
      type: Number,
      require: [true, "Product Qty must be provideed"],
    },
    productPrice: {
      type: Number,
      require: [true, "Price Must be provided"],
    },
    productStatus: {
      type: String,
      enum: ["available", "unavailable"],
    },
    productImage: String,
    // reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export { Product };
