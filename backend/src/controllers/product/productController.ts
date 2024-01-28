const Procut = require("../../models/productModel");
export const createProduct = async (req: Request, res: Response) => {
  const {
    productName,
    productDescription,
    productPrice,
    productStatus,
    productStockQty,
  } = req.body;
};
if (!productName || !productDescreptoon! || !productPrice || !ProductStockQty) {
  return res.status(400).json({
    message: "Please provide ProductName.",
  });
}
