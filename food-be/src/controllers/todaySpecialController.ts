import { Request, Response } from "express";
import { sendError } from "../middlewares/errorHanlder";
import {
  bestChoiceErrors,
  businessErrors,
  categoryErrors,
  productErrors,
  todaySpecialErrors,
} from "../utils/Errors/commonErrors";
import productModel from "../models/productModel";
import businessModel from "../models/businessModel";
import Category from "../models/categoryModel";
import subCategoryModel, { ISubCategory } from "../models/subCategory";
import { Document } from "mongoose";
import { spec } from "node:test/reporters";
import logger from "../loggers/logger";
import { todaySpecialMessages } from "../utils/successMessages/successMessages";

export async function createTodaySpecial(req: Request, res: Response) {
  /*
    #swagger.tags=['todayspecials']
    #swagger.summary='Create today special'
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            name: 'string',
            description: 'string',
            categoryId: 'string',
            subCategoryId: 'string',
            images: 'string',
            price: 'number',
            weight: 'number',
            discountPrice: 'number',
            quantity: 'number',
            units: 'string',
            sizes: 'string',
            isActive: 'boolean',
            packingCharge: 'number',
            businessId: 'string'
        }
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
      businessId
    } = req.body;
    const user = req.user;
    if (!user.businessId) {
      logger.error(
        productErrors.CREATE_BUSINESS_TO_ADD_PRODUCT.error + req.originalUrl
      );
      sendError(res, productErrors.CREATE_BUSINESS_TO_ADD_PRODUCT);
      return;
    }
    const business = await businessModel.findOne({ _id: businessId });
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
    const productDetails = {
      name,
      description,
      category: category.name,
      categoryId,
      subCategoryId: subCategory?._id,
      subCategory: subCategory?._id || "",
      images,
      price,
      weight,
      discountPrice,
      quantity,
      units,
      isActive,
      sizes,
      businessId: businessId,
      packingCharge,
      ownerId: user._id,
      isBestChoice: false,
      isTodaySpecial: true,
      specialDayDate: new Date(),
    };
    const todaySpecial = await productModel.create(productDetails);
    logger.info(
      todaySpecialMessages.TODAY_SPECIAL_ADDED_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(201).json({ data: { todaySpecial } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

// remove todaySpecial controller
export async function removeTodaySpecial(req: Request, res: Response) {
  /*
    #swagger.tags=['todayspecials']
    #swagger.summary='Remove today special'
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    */
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
      logger.error(
        todaySpecialErrors.PRODUCT_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, todaySpecialErrors.PRODUCT_NOT_FOUND);
      return;
    }
    if (!product.isTodaySpecial) {
      logger.error(
        todaySpecialErrors.PRODUCT_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, todaySpecialErrors.PRODUCT_NOT_FOUND);
      return;
    }
    product.isTodaySpecial = false;
    await product.save();
    logger.info(
      todaySpecialMessages.TODAY_SPECIAL_DELETED_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({
      success: true,
      message: todaySpecialMessages.TODAY_SPECIAL_DELETED_SUCCESSFULLY.message,
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

// get restaurent todayspecails
export async function getTodaySpecials(req: Request, res: Response) {
  /*
    #swagger.tags=['todayspecials']
    #swagger.summary='Get today specials'
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    }
    */
  try {
    const id = req.params.id;
    const product = await productModel.find({
      businessId: id,
      isTodaySpecial: true,
    });
    if (!product) {
      logger.error(
        todaySpecialErrors.PRODUCT_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, todaySpecialErrors.PRODUCT_NOT_FOUND);
      return;
    }
    logger.info(
      todaySpecialMessages.TODAY_SPECIAL_FOUND_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({ data: { product } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function getAllTodaySpecials(req: Request, res: Response) {
  /*
    #swagger.tags=['todayspecials']
    #swagger.summary='Get All today specials'
    #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
    },
    #swagger.parameters['active'] = {
        in: 'query',
        required: false,
        type: 'boolean'
    }
    */
  try {
    const { active = false } = req.query;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    let query: any = {
      isTodaySpecial: true,
    };
    if (active) {
      query = {
        ...query,
        specialDayDate: { $gte: startOfDay, $lte: endOfDay },
      };
    }

    const product = await productModel.find(query);
    logger.info(
      todaySpecialMessages.TODAY_SPECIAL_FOUND_SUCCESSFULLY.message +
      req.originalUrl
    );
    res.status(200).json({ data: { product } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}
