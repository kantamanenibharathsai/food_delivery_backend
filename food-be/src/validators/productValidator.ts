import { Request, Response, NextFunction } from "express";
import { sendError } from "../middlewares/errorHanlder";
import { errors } from "../middlewares/errorHanlder";
import {
  validEmail,
  isString,
  isAlphaNum,
  isNumber,
} from "../utils/validationutils";
import { isValidObjectId } from "../utils/validationutils";

export function createProductValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let {
    name,
    description,
    categoryId,
    subCategoryId,

    price,
    weight,
    discountPrice,

    units,
    sizes,
    businessId,
    packingCharge,
  } = req.body;
  const Error: errors = [];
  discountPrice = Number(discountPrice);
  price = Number(price);
  weight = Number(weight);
  packingCharge = Number(packingCharge);
  if (!name) Error.push({ error: "Name field is empty" });
  if (name && !isString(name)) Error.push({ error: "Name must be a string" });
  if (!description) Error.push({ error: "Description field is empty" });
  if (description && !isString(description))
    Error.push({ error: "Description must be a string" });
  if (!categoryId) Error.push({ error: "Category id field is empty" });
  if (categoryId && !isValidObjectId(categoryId)) {
    Error.push({ error: "category is not valid" });
  }
  if (!businessId) Error.push({ error: "businessId field is empty" });
  if (businessId && !isValidObjectId(businessId)) {
    Error.push({ error: "businessId is not valid" });
  }
  if (subCategoryId && !isValidObjectId(subCategoryId)) {
    Error.push({ error: "subCategoryId is not valid" });
  }
  if (!price) Error.push({ error: "Price field is empty" });
  if (price && !isNumber(price))
    Error.push({ error: "Price must be a number" });
  if (!weight) Error.push({ error: "Weight field is empty" });
  if (weight && !isNumber(weight))
    Error.push({ error: "Weight must be a number" });
  if (discountPrice && !isNumber(discountPrice))
    Error.push({ error: "Discount price is not a number" });
  if (!units) Error.push({ error: "Units field is empty" });
  if (units && !isString(units))
    Error.push({ error: "Units must be a string" });
  if (sizes == undefined) Error.push({ error: "Sizes field is empty" });

  if (!packingCharge) Error.push({ error: "Packing charge field is empty" });

  if (Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }
  next();
}
