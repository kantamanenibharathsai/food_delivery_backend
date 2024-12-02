import { Request, Response } from "express";
import userModel from "../models/userModel";
import reviewModel from "../models/reviewModel";
import logger from "../loggers/logger";
import { uploadFiles } from "../libraries/minioLib";
import { sendError } from "../middlewares/errorHanlder";
import { reviewErrors } from "../utils/Errors/commonErrors";
import { reviewMessages } from "../utils/successMessages/successMessages";

export async function addReview(req: Request, res: Response) {
  /*
  #swagger.tags=['review']
  #swagger.consumes=['multipart/form-data']
  #swagger.produces=['application/json']
  #swagger.parameters['authorization']={
    in:'header',
    required:true,
    type:'string'
  },
  #swagger.parameters['restaurantId']={
    in:'formData',
    required:true,
    type:'string'
  },
  #swagger.parameters['description']={
    in:'formData',
    required:false,
    type:'string'
  },
  #swagger.parameters['rating']={
    in:'formData',
    required:true,
    type:'number'
  },
  #swagger.parameters['files']={
    in:'formData',
    required:false,
    type:'array',
    items:{type:'file',format:'binary'}
  }
  */
  try {
    const { restaurantId, description, rating } = req.body;

    let images: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = await uploadFiles(req.files);
    }

    const review = await reviewModel.create({
      restaurantId,
      reviewerId: req.user._id,
      description,
      rating: Number(rating),
      images,
      status: false,
    });

    const updatedReview = await reviewModel
      .findById(review._id)
      .populate("restaurantId");

    logger.info(
      reviewMessages.REVIEW_ADDED_SUCCESSFULLY.message + req.originalUrl
    );

    res.status(201).json({
      data: {
        review: updatedReview,
        message: reviewMessages.REVIEW_ADDED_SUCCESSFULLY.message,
      },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function updateReview(req: Request, res: Response) {
  /*
    #swagger.tags=['review']
    #swagger.consumes=['multipart/form-data']
    #swagger.produces=['application/json']
    #swagger.parameters['authorization']={
      in:'header',
      required:true,
      type:'string'
    },
    #swagger.parameters['id']={
      in:'path',
      required:true,
      type:'string'
    },
    #swagger.parameters['description']={
      in:'formData',
      type:'string',
      required:false
    },
    #swagger.parameters['rating']={
      in:'formData',
      type:'number',
      required:false
    },
    #swagger.parameters['images']={
      in:'formData',
      type:'array',
      required:false,
      items:{type:'file',format:'binary'}
    }
    */
  try {
    const id = req.params.id;
    const { description, rating } = req.body;

    const review = await reviewModel.findById(id);
    if (!review) {
      logger.error(reviewErrors.REVIEW_NOT_FOUND.error + req.originalUrl);
      sendError(res, reviewErrors.REVIEW_NOT_FOUND);
      return;
    }

    if (
      req.user.role !== "ADMIN" &&
      String(review.reviewerId) !== String(req.user._id)
    ) {
      logger.error(reviewErrors.UNAUTHORIZED_USER.error + req.originalUrl);
      sendError(res, reviewErrors.UNAUTHORIZED_USER);
      return;
    }

    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedUrls = await uploadFiles(req.files);
      imageUrls = [...review.images, ...uploadedUrls];
    }

    review.description = description || review.description;
    review.rating = rating || review.rating;
    review.images = imageUrls.length > 0 ? imageUrls : review.images;

    await review.save();

    const updatedReview = await reviewModel.findById(review._id);

    logger.info(
      reviewMessages.REVIEW_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      data: {
        message: reviewMessages.REVIEW_UPDATED_SUCCESSFULLY.message,
        review: updatedReview,
      },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function getReview(req: Request, res: Response) {
  /*
    #swagger.tags=['review']
    #swagger.parameters['authorization']={
        in:'header',
        required:true,
        type:'string'
    }
    #swagger.parameters['reviewId']={
        in:'path',
        required:true,
        type:'string'
    }
    */
  try {
    const reviewId = req.params.reviewId;
    const review = await reviewModel.findById(reviewId);
    // .populate("images")
    // .populate("restaurantId");
    if (!review) {
      logger.error(reviewErrors.REVIEW_NOT_FOUND.error + req.originalUrl);
      sendError(res, reviewErrors.REVIEW_NOT_FOUND);
      return;
    }

    logger.info(
      reviewMessages.REVIEW_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      data: {
        message: reviewMessages.REVIEW_FOUND_SUCCESSFULLY.message,
        review,
      },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error });
  }
}

export async function removeReview(req: Request, res: Response) {
  /*
    #swagger.tags=['review']
    #swagger.parameters['authorization']={
        in:'header',
        required:true,
        type:'string'
    }
    #swagger.parameters['reviewId']={
        in:'path',
        required:true,
        type:'string'
    }
    */
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);
    if (!review) {
      logger.error(reviewErrors.REVIEW_NOT_FOUND.error + req.originalUrl);
      sendError(res, reviewErrors.REVIEW_NOT_FOUND);
      return;
    }

    if (
      req.user.role !== "ADMIN" &&
      String(review.reviewerId) != String(req.user._id)
    ) {
      logger.error(reviewErrors.UNAUTHORIZED_USER.error + req.originalUrl);
      sendError(res, reviewErrors.UNAUTHORIZED_USER);
      return;
    }
    await review.deleteOne();
    logger.info(
      reviewMessages.REVIEW_DELETED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      data: { message: reviewMessages.REVIEW_DELETED_SUCCESSFULLY.message },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error });
  }
}

export async function getAllReviews(req: Request, res: Response) {
  /*
  #swagger.tags=['review']
  #swagger.parameters['authorization']={
    in:'header',
    required:true,
    type:'string'
  }
     #swagger.parameters['restaurantId']={
        in:'path',
        required:true,
        type:'string'
    }
  */
  try {
    const { restaurantId } = req.params;

    const reviews = await reviewModel
      .find({ restaurantId: restaurantId })
      .populate("images")
      .populate("restaurantId");
    logger.info(
      reviewMessages.REVIEW_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { reviews: reviews } });
  } catch (error: any) {
    console.log(error);
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}
