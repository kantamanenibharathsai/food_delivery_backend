import { Request, Response } from "express";
import { sendError } from "../middlewares/errorHanlder";
import {
  bestChoiceErrors,
  businessErrors,
  categoryErrors,
  productErrors,
} from "../utils/Errors/commonErrors";
import productModel from "../models/productModel";
import businessModel from "../models/businessModel";
import Category from "../models/categoryModel";
import mongoose, { Document, isValidObjectId } from "mongoose";
import subCategoryModel, { ISubCategory } from "../models/subCategory";
import { addProduct } from "../libraries/productLIb";
import { exitOnError } from "winston";
import logger from "../loggers/logger";
import { bestChoiceMessages } from "../utils/successMessages/successMessages";
import { uploadFiles } from "../libraries/minioLib";

//create best choice controller
export async function createBestChoice(req: Request, res: Response) {
  /*
    #swagger.tags = ['bestchoice']
    #swagger.summary = 'Create best choice'
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['name'] = {
        in: 'formData',
        type: 'string',
        required: true
    }
    #swagger.parameters['description'] = {
        in: 'formData',
        type: 'string',
        required: true
    }
    #swagger.parameters['categoryId'] = {
        in: 'formData',
        type: 'string',
        required: true
    }
    #swagger.parameters['subCategoryId'] = {
        in: 'formData',
        type: 'string'
    }
    #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        format: 'binary'
    }
    #swagger.parameters['price'] = {
        in: 'formData',
        type: 'number',
        required: true
    }
    #swagger.parameters['weight'] = {
        in: 'formData',
        type: 'number'
    }
    #swagger.parameters['discountPrice'] = {
        in: 'formData',
        type: 'number'
    }
    #swagger.parameters['quantity'] = {
        in: 'formData',
        type: 'number',
        required: true
    }
    #swagger.parameters['units'] = {
        in: 'formData',
        type: 'string'
    }
    #swagger.parameters['sizes'] = {
        in: 'formData',
        type: 'string'
    }
    #swagger.parameters['isActive'] = {
        in: 'formData',
        type: 'boolean'
    }
    #swagger.parameters['packingCharge'] = {
        in: 'formData',
        type: 'number'
    }
*/
  try {
    const {
      name,
      description,
      categoryId,
      subCategoryId,
      images,
      price,
      weight,
      discountPrice,
      quantity,
      units,
      sizes,
      isActive,
      packingCharge,
    } = req.body;
    const user = req.user;
    if (!user.businessId) {
      logger.error(
        productErrors.CREATE_BUSINESS_TO_ADD_PRODUCT.error + req.originalUrl
      );
      sendError(res, productErrors.CREATE_BUSINESS_TO_ADD_PRODUCT);
      return;
    }
    const business = await businessModel.findOne({ _id: user.businessId });
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }

    let subCategory:
      | (Document<unknown, {}, ISubCategory> &
          ISubCategory &
          Required<{
            _id: unknown;
          }> & {
            __v?: number;
          })
      | null = null;
    if (subCategoryId) {
      subCategory = await subCategoryModel.findOne({ _id: subCategoryId });
      if (!subCategory) {
        logger.error(
          categoryErrors.SUB_CATEGORY_NOT_FOUND.error + req.originalUrl
        );
        sendError(res, categoryErrors.SUB_CATEGORY_NOT_FOUND);
        return;
      }
    }
    let image: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = await uploadFiles(req.files);
    }
    const productDetails = {
      name,
      description,
      category: category.name,
      categoryId,
      subCategoryId: subCategory?._id,
      subCategory: subCategory?._id || "",
      images: image[0],
      price,
      weight,
      discountPrice,
      quantity,
      units,
      isActive,
      sizes,
      businessId: user.businessId,
      packingCharge,
      ownerId: user._id,
      isBestChoice: true,
    };
    const savedProduct = await addProduct(productDetails);
    logger.info(
      bestChoiceMessages.BEST_CHOICE_ADDED_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(201).json({
      data: {
        savedProduct,
      },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function getRestaurentBestChoices(req: Request, res: Response) {
  /*
    #swagger.tags=['bestchoice']
    #swagger.summary='Get restaurent best choices'
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
    if (id && !isValidObjectId(id)) {
      logger.error(productErrors.INVALID_PRODUCT_ID.error + req.originalUrl);
      sendError(res, productErrors.INVALID_PRODUCT_ID);
      return;
    }
    const business = await businessModel.findById(id);
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    const bestChoice = await productModel.find({
      businessId: id,
      isActive: true,
      isBestChoice: true,
    });
    logger.info(
      bestChoiceMessages.BEST_CHOICE_FOUND_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({ data: { bestChoice } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function removeBestchoice(req: Request, res: Response) {
  /*
    #swagger.tags=['bestchoice']
    #swagger.summary='Remove best choice'
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
    if (id && !isValidObjectId(id)) {
      logger.error(productErrors.INVALID_PRODUCT_ID.error + req.originalUrl);
      sendError(res, productErrors.INVALID_PRODUCT_ID);
      return;
    }
    const bestChoice = await productModel.findById(id);
    if (!bestChoice) {
      logger.error(
        bestChoiceErrors.BEST_CHOICE_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestChoiceErrors.BEST_CHOICE_NOT_FOUND);
      return;
    }
    if (!bestChoice.isBestChoice) {
      logger.error(
        bestChoiceErrors.BEST_CHOICE_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, bestChoiceErrors.BEST_CHOICE_NOT_FOUND);
      return;
    }
    await bestChoice.deleteOne();
    logger.info(
      bestChoiceMessages.BEST_CHOICE_DELETED_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({
      success: true,
      message: bestChoiceMessages.BEST_CHOICE_DELETED_SUCCESSFULLY.message,
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function getAllBestChoices(req: Request, res: Response) {
  /*
  #swagger.tags=['bestchoice']
  #swagger.summary='Get restaurent best choices'
  #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
  */
  try {
    const bestChoices = await productModel
      .find({ isBestChoice: true })
      .populate("businessId")
      .populate("categoryId");
    res.status(200).json({ data: { bestChoices } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}
