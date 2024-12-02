import { Router } from "express";
import {
  getProductDetails,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByBusiness,
} from "../controllers/productController";
import verifyRole from "../middlewares/verifyRole";
import { createProductValidator } from "../validators/productValidator";
import multer from "multer";
const upload = multer();
const rouets = Router();

rouets.get("/:id", getProductDetails);
rouets.get("/business/:businessId", getProductsByBusiness)
rouets.get("/", getProducts);
rouets.post(
  "/",
  verifyRole(["SELLER"]),
  upload.array("images"),
  createProductValidator,
  createProduct
);
rouets.put(
  "/:id",
  verifyRole(["SELLER"]),
  upload.array("images"),
  updateProduct
);
rouets.delete("/:id", verifyRole(["SELLER"]), deleteProduct);

export default rouets;
