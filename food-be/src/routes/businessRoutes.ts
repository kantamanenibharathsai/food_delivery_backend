import { Router } from "express";
import {
  addBankDetails,
  addUpiDetails,
  createBusiness,
  deleteBusiness,
  getBusiness,
  getNearbyBusiness,
  updateBusiness,
} from "../controllers/businessController";
import verifyRole from "../middlewares/verifyRole";
import {
  validateCreateBusiness,
  validateAddBankDetails,
  validateAddUpiDetails,
} from "../validators/businessValidator";
const routes = Router();
import multer = require("multer");
const upload = multer();

routes.get("/nearby", getNearbyBusiness);
routes.get("/:id", getBusiness);
routes.post(
  "/",
  verifyRole(["SELLER"]),
  upload.array("files"),
  validateCreateBusiness,
  createBusiness
);
routes.put(
  "/:businessId",
  verifyRole(["SELLER"]),
  upload.array("files"),
  updateBusiness
);
routes.delete("/:id", verifyRole(["SELLER", "ADMIN"]), deleteBusiness);
routes.post(
  "/:id/bankdetails",
  verifyRole(["SELLER"]),
  validateAddBankDetails,
  addBankDetails
);
routes.post(
  "/:id/upidetails",
  verifyRole(["SELLER"]),
  validateAddUpiDetails,
  addUpiDetails
);

export default routes;
