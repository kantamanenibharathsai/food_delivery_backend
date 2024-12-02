import productModel from "../models/productModel";

export async function addProduct(productDetails: any) {
  try {
    const product = new productModel(productDetails);
    const savedProduct = await product.save();
    return Promise.resolve(savedProduct);
  } catch (err) {
    return Promise.reject(err);
  }
}
