import { Router } from "express";
import {
  addReview,
  getAllReviews,
  getReview,
  removeReview,
  updateReview,
} from "../controllers/reviewController";
const routes = Router();
import multer from "multer";
import {
  createReviewValidator,
  getReviewValidator,
  removeReviewValidator,
  updateReviewValidator,
} from "../validators/reviewValidators";
const upload = multer();

routes.post("/", upload.array("files"), createReviewValidator, addReview);
routes.put(
  "/update/:id",
  upload.array("images"),
  updateReviewValidator,
  updateReview
);
routes.get("/all/:restaurantId", getAllReviews);
routes.get("/:reviewId", getReviewValidator, getReview);
routes.delete("/:reviewId", removeReviewValidator, removeReview);

export default routes;
