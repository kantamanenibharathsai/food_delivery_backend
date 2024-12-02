import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCart,
  removeCartItem,
  addCartOrder,
  emptyCart
} from "../controllers/cartController";
import {
  addCartOrderValidator,
  addToCartValidator,
  updateCartValidator,

} from "../validators/cartValidators";
const routes = Router();

routes.post("/", addToCartValidator, addToCart);
routes.get("/", getCart);
routes.put("/", updateCartValidator, updateCart);
routes.post("/cartOrder", addCartOrderValidator, addCartOrder);
routes.delete("/remove/:productId", removeCartItem);
routes.delete("/", emptyCart)
export default routes;
