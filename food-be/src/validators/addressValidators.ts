import { Request, Response, NextFunction } from "express";
import {
  isString,
  isAlphaNum,
  isValidObjectId,
  isBoolean,
  isObject,
} from "../utils/validationutils";
import { errors, sendError } from "../middlewares/errorHanlder";
import { addressValidationErrors } from "../utils/Errors/validationErrors";

export function validateCreateAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    flat_house_no,
    area_colony_street,
    address,
    country,
    city,
    state,
    mobile_no,
    user_id,
    isDefault,
    pincode,
    bussinessId,
    coordinates,
  } = req.body;
  let Errors: errors = [];
  if (!flat_house_no || !isString(flat_house_no)) {
    Errors.push({ error: addressValidationErrors.INVALID_FLAT_HOUSE_NO });
  }

  if (!area_colony_street || !isString(area_colony_street)) {
    Errors.push({ error: addressValidationErrors.INVALID_AREA_COLONY_STREET });
  }

  if (!address || !isString(address)) {
    Errors.push({ error: addressValidationErrors.INVALID_ADDRESS });
  }

  if (!country || !isString(country)) {
    Errors.push({ error: addressValidationErrors.INVALID_COUNTRY });
  }

  if (!city || !isString(city)) {
    Errors.push({ error: addressValidationErrors.INVALID_CITY });
  }

  if (!state || !isString(state)) {
    Errors.push({ error: addressValidationErrors.INVALID_STATE });
  }

  if (!mobile_no || !isAlphaNum(mobile_no)) {
    Errors.push({ error: addressValidationErrors.INVALID_MOBILE_NO });
  }

  if (user_id && !isValidObjectId(user_id)) {
    Errors.push({ error: addressValidationErrors.INVALID_USER_ID });
  }

  if (isDefault !== undefined && !isBoolean(isDefault)) {
    Errors.push({ error: addressValidationErrors.INVALID_IS_DEFAULT });
  }

  if (!pincode || !isString(pincode)) {
    Errors.push({ error: addressValidationErrors.INVALID_PINCODE });
  }

  if (bussinessId && !isString(bussinessId)) {
    Errors.push({ error: addressValidationErrors.INVALID_BUSSINESS_ID });
  }

  if (coordinates && !isObject(coordinates)) {
    Errors.push({ error: addressValidationErrors.INVALID_COORDINATES });
  }

  if (coordinates && coordinates.lat && !isAlphaNum(coordinates.lat)) {
    Errors.push({ error: addressValidationErrors.INVALID_LATITUDE });
  }

  if (coordinates && coordinates.long && !isAlphaNum(coordinates.long)) {
    Errors.push({ error: addressValidationErrors.INVALID_LONGITUDE });
  }
  if (Errors && Errors.length > 0) {
    sendError(res, Errors);
    return;
  }
  next();
}

export function validateUpdateAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  let Errors: errors = [];
  if (id && !isValidObjectId(id)) {
    Errors.push({ error: addressValidationErrors.INVALID_ADDRESS_ID });
  }

  const {
    flat_house_no,
    area_colony_street,
    address,
    country,
    city,
    state,
    mobile_no,
    user_id,
    isDefault,
    pincode,
  } = req.body;

  if (flat_house_no && !isString(flat_house_no)) {
    Errors.push({ error: addressValidationErrors.INVALID_FLAT_HOUSE_NO });
  }

  if (area_colony_street && !isString(area_colony_street)) {
    Errors.push({ error: addressValidationErrors.INVALID_AREA_COLONY_STREET });
  }

  if (address && !isString(address)) {
    Errors.push({ error: addressValidationErrors.INVALID_ADDRESS });
  }

  if (country && !isString(country)) {
    Errors.push({ error: addressValidationErrors.INVALID_COUNTRY });
  }

  if (city && !isString(city)) {
    Errors.push({ error: addressValidationErrors.INVALID_CITY });
  }

  if (state && !isString(state)) {
    Errors.push({ error: addressValidationErrors.INVALID_STATE });
  }

  if (mobile_no && !isAlphaNum(mobile_no)) {
    Errors.push({ error: addressValidationErrors.INVALID_MOBILE_NO });
  }

  if (user_id && !isValidObjectId(user_id)) {
    Errors.push({ error: addressValidationErrors.INVALID_USER_ID });
  }

  // if (isDefault !== undefined && !isBoolean(isDefault)) {
  //   Errors.push({ error: addressValidationErrors.INVALID_IS_DEFAULT });
  // }

  if (pincode && !isString(pincode)) {
    Errors.push({ error: addressValidationErrors.INVALID_PINCODE });
  }

  if (Errors && Errors.length > 0) {
    sendError(res, Errors);
    return;
  }
  next();
}

export function validateDeleteAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const Errors: errors = [];
  if (id && !isValidObjectId(id)) {
    Errors.push({ error: addressValidationErrors.INVALID_ADDRESS_ID });
  }

  if (Errors.length > 0) {
    sendError(res, Errors);
    return;
  }
  next();
}

export function validateGetAddress(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.params.id;
  const Errors: errors = [];
  if (id && !isValidObjectId(id)) {
    Errors.push({ error: addressValidationErrors.INVALID_ADDRESS_ID });
  }

  if (Errors.length > 0) {
    sendError(res, Errors);
    return;
  }
  next();
}
