import express, { Request, Response } from "express";
import productCategoryModel from "../models/subCategory";
import { sendError } from "../middlewares/errorHanlder";
import { productCategoyErrors } from "../utils/Errors/commonErrors";
import { isValidObjectId } from "mongoose";
import logger from "../loggers/logger";
import { uploadFiles } from "../libraries/minioLib";

export async function getProductCategories(req: Request, res: Response) {
  /*
  #swagger.tags = ['productCategories']
  #swagger.summary = 'Get product categories'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['category_id'] = {
    in: 'path',
    required: true,
    type:'string'
  }
*/
  try {
    const { category_id } = req.params;
    if (!category_id || !isValidObjectId(category_id)) {
      sendError(res, productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND);
      return;
    }
    const productCategories = await productCategoryModel.find({
      categoryId: category_id,
    });
    if (!productCategories) {
      logger.error(
        productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      productCategoyErrors.PRODUCT_CATEGORY_FOUND_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({ data: { productCategories } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}

export async function getProductCategoryById(req: Request, res: Response) {
  /*
    #swagger.tags = ['productCategories']
    #swagger.summary = 'Get product category by id'
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
    const productCategory = await productCategoryModel.findById(id);
    if (!productCategory) {
      logger.error(
        productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      productCategoyErrors.PRODUCT_CATEGORY_FOUND_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({ data: { productCategory } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}

export async function createProductCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['productCategories']
    #swagger.summary = 'Create product category'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['categoryId']={
      in:'formData',
      required:true,
      type:'string'
    },
    #swagger.parameters['name']={
      in:'formData',
      required:true,
      type:'string'
    },
    #swagger.parameters['category']={
      in:'formData',
      required:true,
      type:'string'
    },
    #swagger.parameters['description']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['startingPrice']={
      in:'formData',
      required:true,
      type:'number'
    },
    #swagger.parameters['files']={
      in:'formData',
      type:'file',
      required:false
    }
    */
  try {
    const { categoryId, name, category, description, startingPrice } = req.body;
    let image: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = await uploadFiles(req.files);
    }
    const productCategory = new productCategoryModel({
      categoryId,
      name,
      image: image[0],
      category,
      description,
      startingPrice,
    });
    const savedProductCategory = await productCategory.save();
    logger.info(
      productCategoyErrors.PRODUCT_CATEGORY_CREATED_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(201).json({ data: { productCategory: savedProductCategory } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}

export async function updateProductCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['productCategories']
    #swagger.summary = 'Update product category'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string'
    },
    #swagger.parameters['name']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['category']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['description']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['startingPrice']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['files']={
      in:'formData',
      type:'file',
      required:false
    }
    */
  try {
    const { id } = req.params;
    const { name, category, description, startingPrice } = req.body;
    let images: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = await uploadFiles(req.files);
    }

    const productCategory = await productCategoryModel.findById(id);
    if (!productCategory) {
      logger.error(
        productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND);
      return;
    }
    productCategory.name = name || productCategory.name;
    productCategory.category = category || productCategory.category;
    productCategory.description = description || productCategory.description;
    productCategory.startingPrice =
      startingPrice || productCategory.startingPrice;
    productCategory.image = images[0] || productCategory.image;
    await productCategory.save();
    logger.info(
      productCategoyErrors.PRODUCT_CATEGORY_UPDATED_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({ data: { productCategory } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}

export async function deleteProductCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['productCategories']
    #swagger.summary = 'Delete product category'
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
    const productCategory = await productCategoryModel.findByIdAndDelete(id);
    if (!productCategory) {
      logger.error(
        productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND.error + req.originalUrl
      );
      sendError(res, productCategoyErrors.PRODUCT_CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      productCategoyErrors.PRODUCT_CATEGORY_DELETED_SUCCESSFULLY.message +
        req.originalUrl
    );
    res.status(200).json({ message: "Product Category deleted successfully" });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}
