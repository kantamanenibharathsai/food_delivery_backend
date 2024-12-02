import { Request, Response, NextFunction } from "express";
import { errors, sendError } from "../middlewares/errorHanlder";
import { orderValidationErrors } from "../utils/Errors/validationErrors";
import { isValidObjectId } from "mongoose";
import { isAlphaNum } from "../utils/validationutils";

export const validateCreateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId, addressId, quantity } = req.body;
  let Errors: errors = [];
  if (!productId) {
    Errors.push({ error: orderValidationErrors.PRODUCT_ID_NOT_FOUND });
  }
  if (!addressId) {
    Errors.push({ error: orderValidationErrors.ADDRESS_ID_NOT_FOUND });
  }
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: orderValidationErrors.INVALID_PRODUCT_ID });
  }
  if (addressId && !isValidObjectId(addressId)) {
    Errors.push({ error: orderValidationErrors.INVALID_ADDRESS_ID });
  }

  if (quantity && quantity <= 0) {
    Errors.push({ error: orderValidationErrors.INVALID_QUANTITY });
  }
  if (Errors && Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
};

export const validatePlaceOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.body;
  let Errors: errors = [];
  if (!orderId) {
    Errors.push({ error: orderValidationErrors.ORDER_ID_NOT_FOUND });
  }
  if (orderId && !isValidObjectId(orderId)) {
    Errors.push({ error: orderValidationErrors.INVALID_ORDER_ID });
  }
  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
};

export const validateCheckPaymentStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { merchantTransactionId } = req.params;
  let Errors: errors = [];
  if (!merchantTransactionId) {
    Errors.push({
      error: orderValidationErrors.MERCHANT_TRANSACTION_ID_NOT_FOUND,
    });
  }
  if (merchantTransactionId && !isAlphaNum(merchantTransactionId)) {
    Errors.push({
      error: orderValidationErrors.INVALID_MERCHANT_TRANSACTION_ID,
    });
  }
  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
};
