import { Router } from "express";
import {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  getProductCategories,
  getProductCategoryById,
} from "../controllers/productCategoryController";
import verifyRole from "../middlewares/verifyRole";
import multer from "multer";
const upload = multer();

const routes = Router();
routes.get("/:category_id", getProductCategories);
routes.get("/:id", getProductCategoryById);
routes.post(
  "/",
  verifyRole(["ADMIN", "SELLER"]),
  upload.array("files"),
  createProductCategory
);
routes.put(
  "/:id",
  verifyRole(["ADMIN", "SELLER"]),
  upload.array("files"),
  updateProductCategory
);
routes.delete("/:id", verifyRole(["ADMIN", "SELLER"]), deleteProductCategory);

export default routes;
