import { Router } from "express";
import {
  refundOrder,
  checkPaymentStatus,
  createOrder,
  placeOrder,
} from "../controllers/orderController";
import {
  validateCheckPaymentStatus,
  validateCreateOrder,
  validatePlaceOrder,
} from "../validators/orderValidators";
const routes = Router();

routes.post("/", validateCreateOrder, createOrder);
routes.post("/placeOrder", validatePlaceOrder, placeOrder);
routes.get(
  "/status/:merchantTransactionId",
  validateCheckPaymentStatus,
  checkPaymentStatus
);
routes.get("/refund/:merchantTransactionId", refundOrder);

export default routes;
