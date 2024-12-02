import { Router } from "express";
import {
  getBestOffers,
  createBestOffer,
  deleteBestOffer,
  updateBestOffer,
  addProductToBestOffer,
  removeBestOfferProduct,
  getBestOffer,
  allBestOffers,
} from "../controllers/bestOfferController";
import verifyRole from "../middlewares/verifyRole";
import {
  validateAddProductToBestOffer,
  validateRemoveProductFromBestOffer,
  validateAddbestoffer,
} from "../validators/bestOfferValidator";
import multer from "multer";

const upload = multer();
const routes = Router();

routes.get("/restuarent/:id", getBestOffers);
routes.get("/:id", getBestOffer);

routes.post(
  "/",
  verifyRole(["ADMIN", "SELLER"]),
  upload.array("files"),
  validateAddbestoffer,
  createBestOffer
);

routes.post(
  "/product",
  verifyRole(["ADMIN", "SELLER"]),
  validateAddProductToBestOffer,
  addProductToBestOffer
);

routes.delete(
  "/product",
  verifyRole(["ADMIN", "SELLER"]),
  validateRemoveProductFromBestOffer,
  removeBestOfferProduct
);

routes.put(
  "/:id",
  verifyRole(["ADMIN", "SELLER"]),
  upload.array("files"),
  updateBestOffer
);

routes.delete(
  "/:bestOfferId/:businessId",
  verifyRole(["ADMIN", "SELLER"]),
  deleteBestOffer
);

routes.get("/", allBestOffers);

export default routes;
