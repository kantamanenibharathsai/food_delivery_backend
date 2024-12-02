import { Request, Response, NextFunction } from "express";
import { errors, sendError } from "../middlewares/errorHanlder";
import { isValidObjectId } from "mongoose";
import { isNumber } from "../utils/validationutils";

export async function addToCartValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { productId, quantity = 1 } = req.body;
  let Errors: errors = [];
  if (!productId) {
    Errors.push({ error: "Product id field is empty" });
  }
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: "Product id is not valid" });
  }
  if (quantity && quantity <= 0) {
    Errors.push({ error: "Quantity must be greater than zero" });
  }
  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }
  next();
}

export async function updateCartValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { productId, quantity } = req.body;
  let Errors: errors = [];
  if (!productId) {
    Errors.push({ error: "Product id field is empty" });
  }
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: "Product id is not valid" });
  }
  if (quantity && quantity <= 0) {
    Errors.push({ error: "Quantity must be greater than zero" });
  }
  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }
  next();
}

export async function addCartOrderValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { productId, quantity } = req.body;
  let Errors: errors = [];
  if (!productId) {
    Errors.push({ error: "Product id field is empty" });
  }
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: "Product id is not valid" });
  }
  if (quantity && quantity <= 0) {
    Errors.push({ error: "Quantity must be greater than zero" });
  }
  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }
  next();
}
