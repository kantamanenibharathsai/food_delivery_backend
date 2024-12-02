import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddressDetails,
  getAllAddress,
  updateAddress,
} from "../controllers/addressController";
import {
  validateCreateAddress,
  validateDeleteAddress,
  validateGetAddress,
  validateUpdateAddress,
} from "../validators/addressValidators";
const routes = Router();

routes.post("/", validateCreateAddress, createAddress);
routes.put("/:addressId", validateUpdateAddress, updateAddress);
routes.get("/all", getAllAddress)
routes.get("/:addressId", validateGetAddress, getAddressDetails);
routes.delete("/:id", validateDeleteAddress, deleteAddress);
export default routes;
