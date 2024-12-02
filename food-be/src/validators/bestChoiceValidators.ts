import { NextFunction, Request, Response } from "express";
import {
  isString,
  isNumber,
  isValidObjectId,
  isBoolean,
  isAlphaNum,
} from "../utils/validationutils";
import { errors, sendError } from "../middlewares/errorHanlder";

export function validateCreateBestChoice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    description,
    categoryId,
    subCategoryId,
    price,
    weight,
    discountPrice,
    quantity,
    units,
    sizes,
    isActive,
    packingCharge,
  } = req.body;

  const Errors: errors = [];

  if (!name) Errors.push({ error: "Name field is empty" });
  if (name && !isString(name)) Errors.push({ error: "Name must be a string" });

  if (description && !isString(description))
    Errors.push({ error: "Description must be a string" });

  if (!categoryId) Errors.push({ error: "Category id field is empty" });
  if (categoryId && !isValidObjectId(categoryId))
    Errors.push({ error: "Category id is not valid" });

  if (subCategoryId && !isValidObjectId(subCategoryId))
    Errors.push({ error: "Sub category id is not valid" });

  if (!price) Errors.push({ error: "Price field is empty" });
  if (price && !isAlphaNum(price))
    Errors.push({ error: "Price must be a number" });

  if (weight && !isAlphaNum(weight))
    Errors.push({ error: "Weight must be a number" });

  if (discountPrice && !isAlphaNum(discountPrice))
    Errors.push({ error: "Discount price must be a number" });

  if (quantity && !isAlphaNum(quantity))
    Errors.push({ error: "Quantity must be a number" });

  if (units && !isString(units))
    Errors.push({ error: "Units must be a string" });

  if (sizes && !isString(sizes))
    Errors.push({ error: "Sizes must be a string" });

  // if (typeof isActive !== "boolean") {
  //   Errors.push({ error: "Is active must be a boolean" });
  // }

  if (packingCharge && !isAlphaNum(packingCharge))
    Errors.push({ error: "Packing charge must be a number" });

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}
