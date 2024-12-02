import { Request, Response, NextFunction } from "express";
import { errors, sendError } from "../middlewares/errorHanlder";
import { isValidObjectId } from "mongoose";
import { isAlphaNum, isString } from "../utils/validationutils";

export async function createReviewValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { restaurantId, rating, description } = req.body;
  let errors: errors = [];
  if (!restaurantId) {
    errors.push({ error: "Restaurant id field is empty" });
  }
  if (restaurantId && !isValidObjectId(restaurantId)) {
    errors.push({ error: "Restaurant id is not valid" });
  }
  if (!rating) {
    errors.push({ error: "Rating field is empty" });
  }
  if (rating && !isAlphaNum(rating) && rating >= 1 && rating <= 5) {
    errors.push({ error: "Rating must be a number between 1 and 5" });
  }
  if (description && !isString(description)) {
    errors.push({ error: "Description is not string" });
  }
  if (errors.length > 0) {
    sendError(res, errors, 400);
    return;
  }
  next();
}

export async function updateReviewValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { rating, description } = req.body;
  let errors: errors = [];
  if (!id) {
    errors.push({ error: "Review id field is empty" });
  }
  if (id && !isValidObjectId(id)) {
    errors.push({ error: "Review id is not valid" });
  }
  if (rating && (rating < 1 || rating > 5)) {
    errors.push({ error: "Rating must be a number between 1 and 5" });
  }
  if (description && !isString(description)) {
    errors.push({ error: "Description must be a string" });
  }
  if (errors.length > 0) {
    sendError(res, errors, 400);
    return;
  }
  next();
}

export async function getReviewValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { reviewId } = req.params;
  let errors: errors = [];
  if (!reviewId) {
    errors.push({ error: "Review id field is empty" });
  }
  if (reviewId && !isValidObjectId(reviewId)) {
    errors.push({ error: "Review id is not valid" });
  }
  if (errors.length > 0) {
    sendError(res, errors, 400);
    return;
  }
  next();
}

export async function removeReviewValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { reviewId } = req.params;
  let errors: errors = [];
  if (!reviewId) {
    errors.push({ error: "Review id field is empty" });
  }
  if (reviewId && !isValidObjectId(reviewId)) {
    errors.push({ error: "Review id is not valid" });
  }
  if (errors.length > 0) {
    sendError(res, errors, 400);
    return;
  }
  next();
}
