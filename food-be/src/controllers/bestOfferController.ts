import { Request, Response } from "express";
import { sendError } from "../middlewares/errorHanlder";
import {
  businessErrors,
  bestOfferErrors,
  productErrors,
} from "../utils/Errors/commonErrors";
import businessModel from "../models/businessModel";
import bestOfferModel from "../models/bestOfferModel";
import productModel from "../models/productModel";
import { isValidObjectId } from "mongoose";
import { uploadFiles } from "../libraries/minioLib";
import logger from "../loggers/logger";
import { bestOfferMessages } from "../utils/successMessages/successMessages";

export async function getBestOffers(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Get all active best offers'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  },
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
   */
  try {
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, { status: 400, error: "Invalid business id" });
      return;
    }
    const business = await businessModel.findById(id);
    if (!business) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    const bestOffers = await bestOfferModel.find({
      businessId: id,
      isActive: true,
    });
    logger.info(
      bestOfferMessages.BEST_OFFER_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { bestOffers } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function getBestOffer(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Get best offer details'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  */
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.INVALID_BEST_OFFER_ID);
      return;
    }
    const bestOffer = await bestOfferModel.findById(id);
    if (!bestOffer) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.BEST_OFFER_NOT_FOUND);
      return;
    }
    logger.info(
      bestOfferMessages.BEST_OFFER_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { bestOffer } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function createBestOffer(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.consumes=['multipart/form-data']
  #swagger.produces=['application/json']
  #swagger.summary = 'Create new best offer'
   #swagger.consumes=['multipart/form-data']
  #swagger.produces=['application/json']
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  },
  #swagger.parameters['businessId']={
    in:'formData',
    required:true,
  },
  #swagger.parameters['isActive']={
    in:'formData',
    required:false,
    type:'boolean'
  },
  #swagger.parameters['offerName']={
    in:'formData',
    required:true,
    type:'string'
  },
  #swagger.parameters['description']={
    in:'formData',
    required:false,
    type:'string'
  },
  #swagger.parameters['files']={
    in:'formData',
    type:'array',
    required:false,
    items:{type:'file',format:'binary'}
  }
  */
  try {
    let { businessId, isActive, offerName, description } = req.body;
    isActive = isActive.toLowerCase() === "false" ? false : true;
    const business = await businessModel.findById(businessId);
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    let image = "";
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = (await uploadFiles(req.files))[0];
    }
    const newBestOffer = await bestOfferModel.create({
      offerName,
      description,
      businessId: businessId,
      isActive,
      image: image,
    });
    logger.info(
      bestOfferMessages.BEST_OFFER_ADDED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(201).json({ data: { newBestOffer } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function updateBestOffer(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.consumes=['multipart/form-data']
  #swagger.produces=['application/json']
  #swagger.summary = 'Update best offer'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  },
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'string'
  },
  #swagger.parameters['businessId']={
    in:'formData',
    required:true,
    type:'string'
  },
  #swagger.parameters['isActive']={
    in:'formData',
    required:false,
    type:'boolean'
  },
  #swagger.parameters['description']={
    in:'formData',
    type:'string',
    required:false
  },
  #swagger.parameters['offerName']={
    in:'formData',
    type:'string',
    required:false
  },
  #swagger.parameters['files']={
    in:'formData',
    type:'array',
    required:false,
    items:{type:'string',format:'binary'}
  }
  */
  try {
    const id = req.params.id;
    const { businessId, isActive, description, offerName } = req.body;
    if (!isValidObjectId(id)) {
      sendError(res, { status: 400, error: "Invalid business id" });
      return;
    }
    const business = await businessModel.findOne({
      _id: businessId,
    });
    if (!business) {
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    const bestOffer = await bestOfferModel.findById(id);
    if (!bestOffer) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.BEST_OFFER_NOT_FOUND);
      return;
    }
    bestOffer.businessId = businessId || bestOffer.businessId;
    bestOffer.isActive = isActive !== undefined ? isActive : bestOffer.isActive;
    bestOffer.offerName = offerName || bestOffer.offerName;
    bestOffer.description = description || bestOffer.description;
    await bestOffer.save();
    const updatedBestOffer = await bestOfferModel.findById(id);
    logger.info(
      bestOfferMessages.BEST_OFFER_UPDATED_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({ data: { updatedBestOffer } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function deleteBestOffer(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Delete best offer'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  },
  #swagger.parameters['bestOfferId'] = {
    in: 'path',
    required: true,
    type: 'string'
  },
  #swagger.parameters['businessId'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  */
  try {
    const { bestOfferId, businessId } = req.params;
    if (!isValidObjectId(bestOfferId)) {
      logger.error(
        bestOfferErrors.INVALID_BEST_OFFER_ID.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.INVALID_BEST_OFFER_ID);
      return;
    }
    // const user = req.user;
    const bestOffer = await bestOfferModel.findOne({
      _id: bestOfferId,
      businessId: businessId,
    });
    if (!bestOffer) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.BEST_OFFER_NOT_FOUND);
      return;
    }
    await bestOffer.deleteOne();
    logger.info(
      bestOfferMessages.BEST_OFFER_DELETED_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({
      success: true,
      message: bestOfferMessages.BEST_OFFER_DELETED_SUCCESSFULLY.message,
    });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function addProductToBestOffer(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Add product to best offer'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  },
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      bestOfferId:'string',
      productId:'string',
      originalPrice:'number',
      offerPrice:'number',
      isActive:'boolean'
    }
  }
  */
  try {
    const {
      bestOfferId,
      productId,
      originalPrice,
      offerPrice,
      isActive = true,
    } = req.body;
    const bestOffer = await bestOfferModel.findOne({ _id: bestOfferId });
    if (!bestOffer) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.BEST_OFFER_NOT_FOUND);
      return;
    }
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    const offerProduct = {
      productId,
      originalPrice,
      offerPrice,
      isActive,
    };
    await bestOfferModel.updateMany(
      { _id: bestOfferId },
      { categoryId: product.categoryId, $push: { products: offerProduct } }
    );
    const updatedBestoffer = await bestOfferModel.findById(bestOfferId);
    logger.info(
      bestOfferMessages.PRODUCT_ADDED_TO_BEST_OFFER.message + req.originalUrl
    );
    res.status(200).json({ data: { updatedBestoffer } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(JSON.stringify(err));
    return;
  }
}

//remove product from best offer
export async function removeBestOfferProduct(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Remove product from best offer'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      bestOfferId:'string',
      productId:'string'
    }
  }
  */
  try {
    const { bestOfferId, productId } = req.body;
    const bestOffer = await bestOfferModel.findOne({ _id: bestOfferId });
    if (!bestOffer) {
      logger.error(
        bestOfferErrors.BEST_OFFER_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestOfferErrors.BEST_OFFER_NOT_FOUND);
      return;
    }
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    const updatedOffer = await bestOfferModel.updateOne(
      { _id: bestOfferId },
      { $pull: { products: { productId: productId } } }
    );
    const updatedBestoffer = await bestOfferModel.findById(bestOfferId);
    logger.info(
      bestOfferMessages.BEST_OFFER_DELETED_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({ data: { updatedBestoffer } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(JSON.stringify(err));
    return;
  }
}

export async function allBestOffers(req: Request, res: Response) {
  /*
  #swagger.tags=['bestOffers']
  #swagger.summary = 'Get all active best offers'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  */
  try {
    const bestOffers = await bestOfferModel.aggregate([
      {
        $match: {
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "businesses",
          localField: "productDetails.businessId",
          foreignField: "_id",
          as: "businessDetails",
        },
      },
      {
        $unwind: {
          path: "$businessDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          offerName: 1,
          image: 1,
          description: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          category: {
            $ifNull: ["$category", null],
          },
          productDetails: {
            $map: {
              input: "$productDetails",
              as: "product",
              in: {
                _id: "$$product._id",
                name: "$$product.name",
                description: "$$product.description",
                price: "$$product.price",
                discountPrice: "$$product.discountPrice",
                businessName: "$businessDetails.businessName",
                categoryName: "$category.name",
                businessId: "$businessDetails._id",
                units: "$$product.units",
                isActive: "$$product.isActive",
                quantity: "$$product.quantity",
                sizes: "$$product.sizes",
                weight: "$$product.weight",
                images: "$$product.images",
                offerPrice: "$offerPrice",
                originalPrice: "$originalPrice",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          offerName: 1,
          image: 1,
          description: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          category: 1,
          productDetails: {
            $cond: {
              if: { $gt: [{ $size: "$productDetails" }, 0] },
              then: "$productDetails",
              else: [],
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          offerName: { $first: "$offerName" },
          image: { $first: "$image" },
          description: { $first: "$description" },
          isActive: { $first: "$isActive" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          category: { $first: "$category" },
          productDetails: { $first: "$productDetails" },
        },
      },
      {
        $project: {
          _id: 0,
          bestOffer: {
            _id: "$_id",
            offerName: "$offerName",
            image: "$image",
            description: "$description",
            isActive: "$isActive",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
            category: "$category",
            productDetails: "$productDetails",
          },
        },
      },
      {
        $sort: {
          "bestOffer.createdAt": -1,
        },
      },
    ]);

    res.status(200).json({ data: bestOffers });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error });
  }
}
