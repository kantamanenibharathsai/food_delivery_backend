import { NextFunction, Request, Response } from "express";
import {
  isString,
  isNumber,
  isValidObjectId,
  isBoolean,
  isAlphaNum,
} from "../utils/validationutils";
import { errors, sendError } from "../middlewares/errorHanlder";

export function validateAddbestoffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { businessId, isActive, offerName, description } = req.body;

  const Errors: errors = [];

  if (!businessId) Errors.push({ error: "Business id field is empty" });
  if (businessId && !isValidObjectId(businessId)) {
    Errors.push({ error: "Business id is not valid" });
  }
  if (!isActive) {
    Errors.push({ error: "isActive field is empty" });
  }
  if (!offerName) Errors.push({ error: "offerName field is empty" });
  if (offerName && !isString(offerName))
    Errors.push({ error: "offerName must be a string" });
  if (!description) Errors.push({ error: "description field is empty" });
  if (description && !isString(description))
    Errors.push({ error: "description must be a string" });

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}

export function validateAddProductToBestOffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { bestOfferId, productId, originalPrice, offerPrice, isActive } =
    req.body;

  const Errors: errors = [];

  if (!bestOfferId) Errors.push({ error: "Best Offer id field is empty" });

  if (!productId) Errors.push({ error: "Product id field is empty" });
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: "Product id is not valid" });
  }

  if (!originalPrice) Errors.push({ error: "Original price field is empty" });
  if (originalPrice != undefined && !isAlphaNum(originalPrice))
    Errors.push({ error: "Original price must be a number" });

  if (!offerPrice) Errors.push({ error: "Offer price field is empty" });
  if (offerPrice != undefined && !isAlphaNum(offerPrice))
    Errors.push({ error: "Offer price must be a number" });
  if (isActive != undefined && !isBoolean(isActive))
    Errors.push({ error: "isActive must be a boolean value" });

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}

export function validateRemoveProductFromBestOffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { bestOfferId, productId } = req.body;

  const Errors: errors = [];

  if (!bestOfferId) Errors.push({ error: "Best Offer id field is empty" });
  if (bestOfferId && !isValidObjectId(bestOfferId)) {
    Errors.push({ error: "Best Offer id is not valid" });
  }

  if (!productId) Errors.push({ error: "Product id field is empty" });
  if (productId && !isValidObjectId(productId)) {
    Errors.push({ error: "Product id is not valid" });
  }

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}
