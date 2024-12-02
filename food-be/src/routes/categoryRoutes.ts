import { Router } from "express";
const routes = Router();
import {
  getCategoryById,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByBusinessId,
} from "../controllers/categoryController";
import verifyRole from "../middlewares/verifyRole";
import {
  addSubCategoryValidator,
  createCategoryValidator,
} from "../validators/categoryValidator";
import multer from "multer";
const upload = multer();

routes.get("/", getCategories);
routes.get("/:id", getCategoryById);
routes.get("/business/:id", getCategoriesByBusinessId);
routes.post(
  "/",
  verifyRole(["ADMIN"]),
  upload.array("files"),
  createCategoryValidator,
  createCategory
);
routes.put(
  "/:id",
  verifyRole(["ADMIN"]),
  upload.array("files"),
  updateCategory
);
routes.delete("/:id", verifyRole(["ADMIN"]), deleteCategory);

export default routes;
