import { Request, Response, NextFunction } from "express";
import subCategoryModel from "../models/subCategory";
import Category from "../models/categoryModel";
import { sendError } from "../middlewares/errorHanlder";
import { categoryErrors } from "../utils/Errors/commonErrors";
import { isValidObjectId } from "mongoose";
import { uploadFiles } from "../libraries/minioLib";
import logger from "../loggers/logger";
import { categoryMessages } from "../utils/successMessages/successMessages";

export async function getCategories(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Get all categories'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    */
  try {
    const categories = await Category.find({});
    logger.info(
      categoryMessages.CATEGORY_FOUND_SUCCESSFULLY.messages + req.originalUrl
    );
    res.status(200).json({ data: { categories } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Get category by id'
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
      sendError(res, categoryErrors.INVALID_CATEGORY_ID);
      return;
    }
    const category = await Category.findById(id);
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      categoryMessages.CATEGORY_FOUND_SUCCESSFULLY.messages + req.originalUrl
    );
    res.status(200).json({ data: { category } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function createCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Create category'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['name'] = {
      in: 'formData',
      type: 'string',
      required: true,
      description: 'Name of the category'
    }
    #swagger.parameters['description'] = {
      in: 'formData',
      type: 'string',
      required: true,
      description: 'Description of the category'
    }
    #swagger.parameters['files'] = {
      in: 'formData',
      required: false,
      type: 'file',
      items: { type: 'file', format: 'binary' }
    }
  */
  try {
    const { name, description } = req.body;

    const oldCategory = await Category.findOne({ name });
    if (oldCategory) {
      sendError(res, categoryErrors.CATEGORY_ALREADY_EXISTS);
      return;
    }

    let image = "";
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedFiles = await uploadFiles(req.files);
      image = uploadedFiles[0];
    }

    const category = await Category.create({
      name,
      description,
      image,
    });
    logger.info(
      categoryMessages.CATEGORY_CREATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(201).json({ data: { category } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Update category'
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
    #swagger.parameters['name'] = {
      in: 'formData',
      type: 'string',
      required: false,
      description: 'Name of the category'
    }
    #swagger.parameters['description'] = {
      in: 'formData',
      type: 'string',
      required: false,
      description: 'Description of the category'
    }
    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      required: false
    }
  */
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }

    let image = category.image;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedImages = await uploadFiles(req.files);
      image = uploadedImages[0];
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image;

    await category.save();

    const categoryDoc = await Category.findById(category._id);
    logger.info(
      categoryMessages.CATEGORT_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );

    res.status(200).json({ data: { categoryDoc } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Delete category'
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
      sendError(res, categoryErrors.INVALID_CATEGORY_ID);
      return;
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      categoryMessages.CATEGORY_REMOVED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      data: {
        message: categoryMessages.CATEGORY_REMOVED_SUCCESSFULLY.message,
      },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
    return;
  }
}

// export async function addBusinessCategory(req: Request, res: Response) {
//   /*
//     #swagger.tags = ['categories']
//     #swagger.summary = 'Add business category'
//     #swagger.parameters['authorization'] = {
//       in: 'header',
//       required: true,
//       type: 'string'
//     }
//     #swagger.parameters['body'] = {
//       in: 'body',
//       required: true,
//       schema: {
//         categoryId:'string',
//         name:'string'
//       }
//     }
//   */
//   try {
//     const { categoryId, name } = req.body;
//     const businessId = req.user.businessId;

//     if (!categoryId) {
//       return sendError(res, categoryErrors.INVALID_CATEGORY_ID);
//     }
//     if (!businessId) {
//       return sendError(res, categoryErrors.INVALID_BUSINESS_ID);
//     }
//     const category = await Category.findById(categoryId);
//     const subCategory = await subCategoryModel.findOne({
//       $and: [{ categoryId }, { name }],
//     });
//     if (subCategory) {
//       logger.error(
//         categoryErrors.SUBCATEGORY_ALREADY_EXISTS.error + req.originalUrl
//       );
//       sendError(res, categoryErrors.SUBCATEGORY_ALREADY_EXISTS);
//       return;
//     }
//     const newcategory = await subCategoryModel.create({
//       categoryId,
//       name,
//       category: category?.name,
//       isBusinessCategory: true,
//       resturantId: businessId,
//       sellerId: req.user._id,
//     });

//     logger.info(
//       categoryMessages.BUSINESS_CATEGORY_CREATED_SUCCESFULLY.message +
//         req.originalUrl
//     );

//     res.status(200).json({ data: { newcategory } });
//   } catch (error: any) {
//     logger.error(error.message + req.originalUrl);
//     res.status(500).json({ error: error.message });
//   }
// }

export async function getCategoriesByBusinessId(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Get categories by business id'
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
    const categories = await Category.find({
      $or: [{ isBusinessCategory: false }, { resturantId: businessId }],
    });
    logger.info(
      categoryMessages.CATEGORY_FOUND_SUCCESSFULLY.messages + req.originalUrl
    );
    res.status(200).json({ data: { categories } });
  } catch (err) {
    logger.error(err + req.originalUrl);
    res.status(500).json({ error: err });
    return;
  }
}

export async function addSubCategory(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Add sub category'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['name'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'Name of the sub category'
    }
    #swagger.parameters['description'] = {
        in: 'formData',
        type: 'string',
        required: false,
        description: 'Description of the sub category'
    }
    #swagger.parameters['categoryId'] = {
        in: 'formData',
        type: 'string',
        required: true,
        description: 'ID of the parent category'
    },
    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      required: false
    }
  */
  try {
    const { categoryId, name, description = "" } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }

    const oldSubcategory = await subCategoryModel.findOne({ name, categoryId });
    if (oldSubcategory) {
      logger.error(
        categoryErrors.SUBCATEGORY_ALREADY_EXISTS.error + req.originalUrl
      );
      sendError(res, categoryErrors.SUBCATEGORY_ALREADY_EXISTS);
      return;
    }

    let image = "";
    if (req.files && Array.isArray(req.files)) {
      image = (await uploadFiles(req.files))[0];
    }

    const subCategory = new subCategoryModel({
      categoryId,
      name,
      category: category.name,
      description,
      image,
    });

    const savedSubCategory = await subCategory.save();

    res.status(201).json({ data: { savedSubCategory } });
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

export async function getSubCategories(req: Request, res: Response) {
  /*
    #swagger.tags = ['categories']
    #swagger.summary = 'Get sub categories'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['categoryId'] = {
      in: 'query',
      required: true,
      type: 'string'
    }
    }  
    */
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      sendError(res, categoryErrors.INVALID_CATEGORY_ID);
      return;
    }
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      logger.error(categoryErrors.CATEGORY_NOT_FOUND.error + req.originalUrl);
      sendError(res, categoryErrors.CATEGORY_NOT_FOUND);
      return;
    }
    logger.info(
      categoryMessages.CATEGORY_FOUND_SUCCESSFULLY.messages + req.originalUrl
    );
    const subCategories = await subCategoryModel.find({ categoryId });
    res.status(200).json({ data: { subCategories } });
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err });
    return;
  }
}
