import { Router } from "express";
const routes = Router();
import { addSubCategory, getSubCategories, } from "../controllers/categoryController";
import { addSubCategoryValidator } from "../validators/categoryValidator";
import multer from "multer";
import verifyRole from "../middlewares/verifyRole";

const upload = multer();
routes.post("/", verifyRole(["ADMIN"]), upload.array('files'), addSubCategoryValidator, addSubCategory);
routes.get("/", getSubCategories)

export default routes;