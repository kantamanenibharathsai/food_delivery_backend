import express, { Request, Response } from "express";
import businessModel, { businessSchema } from "../models/businessModel";
import { errors, sendError } from "../middlewares/errorHanlder";
import { businessErrors, userErrors } from "../utils/Errors/commonErrors";
import AddressModel from "../models/addressModel";
import userModel from "../models/userModel";
import { isValidObjectId } from "mongoose";
// import { isLatLong } from "../validators/businessValidator";
import logger from "../loggers/logger";
import { businessMessages } from "../utils/successMessages/successMessages";
import { uploadFiles } from "../libraries/minioLib";
import bankDetailsModel from "../models/bankDetailsModel";
import { isAlphaNum, isNumber } from "../utils/validationutils";

export async function getBusiness(req: Request, res: Response) {
  /*
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Get business details'
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
      sendError(res, { status: 400, error: "Invalid business id" });
      return;
    }
    const business = await businessModel.findById(id, {
      backAccountDetails: false,
      upiDetails: false,
    });
    if (!business) {
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    res.status(200).json(business);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
}

export async function createBusiness(req: Request, res: Response) {
  /* 
  #swagger.tags = ['bussiness']
  #swagger.summary = 'Create business'
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['businessName'] = {
    in: 'formData',
    type: 'string',
    required: true
  }
  #swagger.parameters['ownerName'] = {
    in: 'formData',
    required: true,
    type: 'string'
  }
  #swagger.parameters['address'] = {
    in: 'formData',
    required: true,
    type: 'string'
  }
  #swagger.parameters['gstNo'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['email'] = {
    in: 'formData',
    required: true,
    type: 'string'
  }
  #swagger.parameters['lat'] = {
    in: 'formData',
    required: true,
    type: 'number'
  }
  #swagger.parameters['long'] = {
    in: 'formData',
    required: true,
    type: 'number'
  }
  #swagger.parameters['files'] = {
    in: 'formData',
    required: false,
    type:'file',
    items: { type: 'file', format: 'binary' }
  }
*/

  try {
    const user = req.user;
    if (!user.verified) {
      sendError(res, userErrors.USER_NOT_VERIFIED);
      return;
    }
    const { businessName, ownerName, address, gstNo, email, lat, long } =
      req.body;
    const oldBusiness = await businessModel.findOne({
      businessName: businessName,
      ownerId: user._id,
    });
    if (oldBusiness) {
      sendError(res, businessErrors.BUSINESS_WITH_SAME_NAME_ALREADY_EXISTS);
      return;
    }
    let image: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = await uploadFiles(req.files);
    }
    const coordinates = { lat, long };
    const userData = await userModel.findOne({ _id: user._id });
    const businessObj = {
      ownerName,
      gstNo,
      email,
      image: image[0],
      businessName,
      ownerId: user._id,
      location: {
        type: "Point",
        coordinates: [coordinates.lat, coordinates.long],
      },
    };
    const business = await businessModel.create(businessObj);
    const businessAddress = await AddressModel.create({
      address: address,
      businessId: business.id,
    });
    await business.updateOne({ addressId: businessAddress.id });
    await userData?.updateOne({ businessId: business.id });
    logger.info(
      businessMessages.BUSINESS_CREATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(201).json({ data: { business } });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json(JSON.stringify(error));
  }
}

export async function updateBusiness(req: Request, res: Response) {
  /* 
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Update business'
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
    #swagger.parameters['businessName'] = {
      in: "formData",
      required: false,
      type: 'string'
    }
    #swagger.parameters['ownerName'] = {
      in: 'formData',
      required: false,
      type: 'string'
    }
    #swagger.parameters['address'] = {
      in: 'formData',
      required: false,
      type: 'string'
    }
    #swagger.parameters['gstNo'] = {
      in: 'formData',
      required: false,
      type: 'string'
    }
    #swagger.parameters['email'] = {
      in: 'formData',
      required: false,
      type: 'string'
    }
    #swagger.parameters['long'] = {
      in: 'formData',
      required: false,
      type: 'number'
    }
    #swagger.parameters['lat'] = {
      in: 'formData',
      required: false,
      type: 'number'
    }
    #swagger.parameters['files'] = {
      in: 'formData',
      type: 'file',
      required: false
    }
  */

  try {
    const id = req.params.businessId;
    const { businessName, ownerName, address, gstNo, email, long, lat } =
      req.body;
    const business = await businessModel.findById(id);

    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }

    let image: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = await uploadFiles(req.files);
    }

    business.businessName = businessName || business.businessName;
    business.ownerName = ownerName || business.ownerName;
    business.address = address || business.address;
    business.gstNo = gstNo || business.gstNo;
    business.email = email || business.email;

    if (lat && long) {
      business.location = {
        type: "Point",
        coordinates: [long, lat],
      };
    }
    business.image = image[0] || business.image;

    await business.save();

    logger.info(
      businessMessages.BUSINESS_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { business } });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteBusiness(req: Request, res: Response) {
  /*
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Delete business'
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
      sendError(res, { status: 400, error: "Invalid business id" });
      return;
    }
    const business = await businessModel.findByIdAndDelete(id);
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    logger.info(
      businessMessages.BUSINESS_DELETED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({
      success: true,
      message: businessMessages.BUSINESS_DELETED_SUCCESSFULLY.message,
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function addBankDetails(req: Request, res: Response) {
  /* 
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Add bank details'
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
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        accountNo: "string",
        ifscCode: "string",
        bankName: "string",
        accountHolderName: "string"
      }
    }
  */
  try {
    const id = req.params.id;
    const business = await businessModel.findById(id);
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }

    const { accountNo, ifscCode, bankName, accountHolderName } = req.body;

    const bankDetailsDoc = await bankDetailsModel.findOne({
      $and: [{ accountHolderName }, { accountNo }, { ifscCode }, { bankName }],
    });

    if (bankDetailsDoc) {
      logger.error(
        businessErrors.BANK_ACCOUNT_ALREADY_EXISTS.error + req.originalUrl
      );
      sendError(res, businessErrors.BANK_ACCOUNT_ALREADY_EXISTS);
      return;
    }

    const bankDetails = await bankDetailsModel.create({
      accountHolderName,
      accountNo,
      ifscCode,
      bankName,
      businessId: business._id,
      isBusiness: true,
    });

    business.accountCompleted = true;
    await business.save();
    const bankDoc = await bankDetailsModel
      .findById(bankDetails._id)
      .populate("businessId");
    logger.info(
      businessMessages.BANK_DETAILS_ADDED_SUCCESSFULLY.message + req.originalUrl
    );

    res.status(200).json({
      data: { bankDoc },
    });
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function addUpiDetails(req: Request, res: Response) {
  /*
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Add upi details'
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
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema:{
        upiId:"string"
      }
    }
    */
  try {
    const id = req.params.id;
    const business = await businessModel.findById(id);
    if (!business) {
      logger.error(businessErrors.BUSINESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, businessErrors.BUSINESS_NOT_FOUND);
      return;
    }
    const { upiId } = req.body;
    const bankDetailsDoc = await bankDetailsModel.findOne({
      businessId: business._id,
      upiId: upiId,
    });
    if (bankDetailsDoc) {
      logger.error(businessErrors.UPI_ALREADY_EXISTS.error + req.originalUrl);
      sendError(res, businessErrors.UPI_ALREADY_EXISTS);
      return;
    }
    const bankDetails = await bankDetailsModel.create({
      upiId,
      businessId: business._id,
      isBusiness: true,
    });

    business.accountCompleted = true;
    await business.save();
    const bankDoc = await bankDetailsModel
      .findById(bankDetails._id)
      .populate("businessId");
    logger.info(
      businessMessages.UPI_ADDED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(202).json({ data: { bankDoc } });
    return;
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

export async function getNearbyBusiness(req: Request, res: Response) {
  /*
    #swagger.tags = ['bussiness']
    #swagger.summary = 'Get nearby business'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['lat'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    #swagger.parameters['long'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    #swagger.parameters['minDistance'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    #swagger.parameters['maxDistance'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'string'
    }
    */
  try {
    const {
      lat,
      long,
      minDistance = 0,
      maxDistance = 1000,
      page = 1,
      limit = 10,
    } = req.query;
    const Errors: errors = [];

    if (!lat) {
      Errors.push({ status: 404, error: "latitude is not provided" });
    }
    if (!long) {
      Errors.push({ error: "longitude is not provided" });
    }

    if (lat && !isAlphaNum(String(lat))) {
      Errors.push({ error: "latitude is not a number" })
    }
    if (long && !isAlphaNum(String(long))) {
      Errors.push({ error: "longitude is not a number" })
    }
    if (Errors.length > 0) {
      sendError(res, Errors, 400);
      return;
    }
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;
    const businesses = await businessModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lat),Number(long),],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: Number(maxDistance),
          minDistance: Number(minDistance),
        },
      },
      { $skip: skip },
      { $limit: limitNumber },
    ]);
    res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json(JSON.stringify(err));
  }
}
