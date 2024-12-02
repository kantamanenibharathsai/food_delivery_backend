import { NextFunction, Request, Response } from "express";
import {
  isString,
  isNumber,
  isValidObjectId,
  isBoolean,
  validEmail,
  isAlphaNum,
} from "../utils/validationutils";
import { errors, sendError } from "../middlewares/errorHanlder";

export function validateCreateBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { businessName, ownerName, address, gstNo, email, lat, long } =
    req.body;
  const Error: errors = [];

  if (!businessName) Error.push({ error: "Business name field is empty" });
  if (businessName && !isString(businessName))
    Error.push({ error: "Business name must be a string" });
  if (!ownerName) Error.push({ error: "Owner name field is empty" });
  if (ownerName && !isString(ownerName))
    Error.push({ error: "Owner name must be a string" });
  if (!address) Error.push({ error: "Address field is empty" });
  if (address && !isString(address))
    Error.push({ error: "Address must be a string" });
  if (!lat) {
    Error.push({ error: "Lat field is empty" });
  }
  if (!long) {
    Error.push({ error: "long Field is empty" });
  }
  if (gstNo && !isString(gstNo))
    Error.push({ error: "GST No must be a string" });
  if (!email) Error.push({ error: "Email field is empty" });
  if (email && !isString(email))
    Error.push({ error: "Email must be a string" });
  if (email && !validEmail(email)) Error.push({ error: "Email is not valid" });
  if (lat && !isAlphaNum(lat)) {
    Error.push({ error: "lat is not a valid number" });
  }
  if (long && !isAlphaNum(long)) {
    Error.push({ error: "Long is not a valid number" });
  }
  if (Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }
  next();
}

export async function validateAddBankDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { accountNo, ifscCode, bankName, accountHolderName } = req.body;
  const Errors: errors = [];

  if (!accountHolderName)
    Errors.push({ error: "Account holder name field is empty" });
  if (accountHolderName && !isString(accountHolderName))
    Errors.push({ error: "Account holder name must be a string" });
  if (!accountNo) Errors.push({ error: "Account number field is empty" });
  if (accountNo && !isString(accountNo))
    Errors.push({ error: "Account number must be a string" });
  if (!ifscCode) Errors.push({ error: "IFSC code field is empty" });
  if (ifscCode && !isString(ifscCode))
    Errors.push({ error: "IFSC code must be a string" });
  if (!bankName) Errors.push({ error: "Bank name field is empty" });
  if (bankName && !isString(bankName))
    Errors.push({ error: "Bank name must be a string" });

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}

export async function validateAddUpiDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { upiId } = req.body;
  const Errors: errors = [];

  if (!upiId) Errors.push({ error: "UPI id field is empty" });
  if (upiId && !isString(upiId))
    Errors.push({ error: "UPI id must be a string" });

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}

export function isLatLong(obj: any) {
  return (
    obj &&
    typeof obj === "object" &&
    "lat" in obj &&
    "long" in obj &&
    isAlphaNum(obj.lat) &&
    isAlphaNum(obj.long)
  );
}
