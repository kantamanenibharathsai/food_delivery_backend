import { Request, Response } from "express";
import productModel from "../models/productModel";
import { Document, PipelineStage } from "mongoose";
import { sendError } from "../middlewares/errorHanlder";
import {
  businessErrors,
  categoryErrors,
  productErrors,
} from "../utils/Errors/commonErrors";
import businessModel from "../models/businessModel";
import { errorMonitor } from "events";
import { fileURLToPath } from "url";
import { addProduct } from "../libraries/productLIb";
import Category from "../models/categoryModel";
import subCategoryModel, { ISubCategory } from "../models/subCategory";
import { isValidObjectId } from "../utils/validationutils";
import { uploadFiles } from "../libraries/minioLib";
import logger from "../loggers/logger";
import { productMessages } from "../utils/successMessages/successMessages";

export async function createProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
      #swagger.summary = 'Upload product images and other details.'
      #swagger.consumes = ['multipart/form-data']
      #swagger.produces = ['application/json']
      #swagger.parameters['authorization'] = {
        in: 'header',
        required: true,
        type: 'string'
      }
      #swagger.parameters['name'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'Name of the product'
      }
      #swagger.parameters['description'] = {
        in: 'formData',
        type: 'string',
      }
      #swagger.parameters['categoryId'] = {
        in: 'formData',
        type: 'string',
        required:'true'
      }
      #swagger.parameters['subCategoryId'] = {
        in: 'formData',
        type: 'string',
      }
      #swagger.parameters['packingCharge'] = {
        in: 'formData',
        type: 'string',
      }
      #swagger.parameters['price'] = {
        in: 'formData',
        type: 'number',
        required: true,
        description: 'Price of the product'
      }
      #swagger.parameters['weight'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'Weight of the product'
      }
      #swagger.parameters['discountPrice'] = {
        in: 'formData',
        type: 'number',
        required: false,
        description: 'Discounted price of the product'
      }
      #swagger.parameters['quantity'] = {
        in: 'formData',
        type: 'number',
        required: false,
        description: 'Quantity of the product'
      }
      #swagger.parameters['units'] = {
        in: 'formData',
        type: 'number',
        required: false,
        description: 'Units of measurement for the product'
      }
      #swagger.parameters['sizes'] = {
        in: 'formData',
        type: 'array',
        required: false,
        
      }
      #swagger.parameters['isActive'] = {
        in: 'formData',
        type: 'boolean',
        required: true,
        description: 'Whether the product is active'
      },
      #swagger.parameters['businessId']={
        in:'formData',
        type:'string',
        required:true
      },
      #swagger.parameters['images'] = {
        in: 'formData',
        type: 'array',
        required: false,
        description: 'Product images',
        collectionFormat: 'multi',
        items: { type: 'file', format: 'binary' }
      }
    */

  try {
    let {
      name,
      description,
      categoryId,
      subCategoryId,
      price,
      weight,
      discountPrice,
      quantity,
      units,
      sizes,
      isActive,
      packingCharge,
      businessId,
    } = req.body;
    let images: string[] = [];
    const user = req.user;
    console.log(req.files);
    if (isActive === false) isActive = false;
    else isActive = true;

    // Check if the user has a business ID
    if (!user.businessId) {
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

    let subCategory = null;
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
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = await uploadFiles(req.files);
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
      businessId: user.businessId,
      packingCharge,
      ownerId: user._id,
    };

    const savedProduct = await addProduct(productDetails);
    logger.info(
      productMessages.PRODUCT_CREATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(201).json({ data: { product: savedProduct } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json(err);
  }
}

export async function getProducts(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Get all products'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['findByName'] = {
      in: 'query',
      type: 'string',
      description: 'Filter by product name'
    }
    #swagger.parameters['findByDescription'] = {
      in: 'query',
      type: 'string',
      description: 'Filter by product description'
    }
    #swagger.parameters['sortByPrice'] = {
      in: 'query',
      type: 'number',
      description: 'Filter by product price'
    }
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'string',
      description: 'Filter by product category'
    }
  */
  try {
    const { sortByPrice, category, findByName, findByDescription } = req.query;
    const { buseinessId } = req.params;
    let filter = [];
    if (sortByPrice) {
      filter.push({ $sort: { price: sortByPrice === "asc" ? 1 : -1 } });
    }
    if (category) {
      filter.push({
        $match: {
          category: { $regex: category, $options: "i" },
        },
      });
    }
    if (findByName) {
      filter.push({
        $match: {
          name: { $regex: findByName, $options: "i" },
        },
      });
    }
    if (findByDescription) {
      filter.push({
        $match: {
          description: { $regex: findByDescription, $options: "i" },
        },
      });
    }
    if (filter.length === 0) {
      const filters = await productModel.find({});
      res.status(200).json({ data: { products: filters } });
      return;
    }

    const filterProduct = await productModel.aggregate(
      filter as PipelineStage[]
    );

    res.status(200).json({ data: { filterProduct } });
  } catch (err) {
    res.status(500).json(err);
    return;
  }
}

export async function getProductsByBusiness(req: Request, res: Response) {
  /*
     #swagger.tags = ['Products']
     #swagger.summary = 'Get products by businessId'
     #swagger.parameters['authorization'] = {
       in: 'header',
       required: true,
       type: 'string'
     }
     #swagger.parameters['businessId'] = {
       in: 'path',
      required: true,
      type: 'string'
     }
   */
  try {
    const { businessId } = req.params;
    if (!isValidObjectId(businessId)) {
      sendError(res, { error: "Please enter a valid businessId" })
      return
    }

    const filterProduct = await productModel.find({ businessId: businessId })

    res.status(200).json({ data: { filterProduct } });
  } catch (err) {
    res.status(500).json(err);
    return;
  }

}

export async function getProductDetails(req: Request, res: Response) {
  /* 
    #swagger.tags = ['Products']
    #swagger.summary = 'Get product details'
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
    const id = req.params.id;

    if (!isValidObjectId(id)) {
      sendError(res, { status: 400, error: "Invalid product id" });
      return;
    }
    const product = await productModel.findById(id);
    if (!product) {
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
}
export async function updateProduct(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Update product'
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
    #swagger.parameters['description']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['categoryId']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['subCategoryId']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['price']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['weight']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['discountPrice']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['quantity']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['units']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['sizes']={
      in:'formData',
      required:false,
      type:'array'
    },
    #swagger.parameters['isActive']={
      in:'formData',
      required:false,
      type:'boolean'
    },
    #swagger.parameters['packingCharge']={
      in:'formData',
      required:false,
      type:'number'
    },
    #swagger.parameters['businessId']={
      in:'formData',
      required:false,
      type:'string'
    },
    #swagger.parameters['images']={
      in:'formData',
      required:false,
      type:'file'
    }
  */
  try {
    const id = req.params.id;
    let {
      name,
      description,
      categoryId,
      subCategoryId,
      price,
      weight,
      discountPrice,
      quantity,
      units,
      sizes,
      isActive,
      packingCharge,
      businessId,
    } = req.body;
    const product = await productModel.findById(id);
    if (String(product?.businessId) != String(req.user.businessId)) {
      sendError(res, productErrors.NO_PERMISSION_TO_UPDATE_PRODUCT);
      return;
    }
    let images: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      images = await uploadFiles(req.files);
    }
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      { _id: id },
      {
        name: name || product.name,
        description: description || product.description,
        categoryId: categoryId || product.categoryId,
        subCategoryId: subCategoryId || product.subCategoryId,
        price: price || product.price,
        weight: weight || product.weight,
        discountPrice: discountPrice || product.discountPrice,
        quantity: quantity || product.quantity,
        units: units || product.units,
        sizes: sizes || product.sizes,
        isActive: isActive || product.isActive,
        packingCharge: packingCharge || product.packingCharge,
        businessId: businessId || product.businessId,
        images: images || product.images,
      },
      { new: true }
    );
    logger.info(
      productMessages.PRODUCT_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { updatedProduct } });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function deleteProduct(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Delete product'
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
      sendError(res, { status: 400, error: "Invalid product id" });
      return;
    }
    const product = await productModel.findById(id);
    if (!product) {
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    if (String(product?.businessId) != String(req.user.businessId)) {
      sendError(res, productErrors.NO_PERMISSION_TO_DELETE_PRODUCT);
      return;
    }
    const deletedProduct = await product.deleteOne();
    logger.info(
      productMessages.PRODUCT_DELETED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      data: { message: productMessages.PRODUCT_DELETED_SUCCESSFULLY.message },
    });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}
