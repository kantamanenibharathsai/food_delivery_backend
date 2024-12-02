import express, { Request, Response } from "express";
import { sendError } from "../middlewares/errorHanlder";
import AddressModel from "../models/addressModel";
import {
  addressErrors,
  businessErrors,
  userErrors,
} from "../utils/Errors/commonErrors";
import logger from "../loggers/logger";
import { addressMessages } from "../utils/successMessages/successMessages";
import userModel from "../models/userModel";
import mongoose from "mongoose";
type AddressType = {
  _id: any;
  flat_house_no: string;
  area_colony_street: string;
  address: string;
  country: string;
  city: string;
  state: string;
  mobile_no: string;
  user_id: any;
  isDefault: boolean;
  pincode: string;
  bussinessId: any;
  coordinates: {
    lat: number;
    long: number;
  };
  landmark: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAddressDetails(req: Request, res: Response) {
  /*
  #swagger.tags=['Address']
  #swagger.parameters['authorization']={
    in:"header",
    required:'true'
  }
  #swagger.parameters['addressId'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  */
  try {
    const addressId = req.params.addressId;
    const user = await userModel.findById(req.user._id).populate("addresess");
    const userAddress = user?.addresess;
    const address = userAddress?.find(
      (address: any) => address._id.toString() == addressId
    );

    if (!address) {
      sendError(res, addressErrors.ADDRESS_NOT_FOUND);
      return;
    }
    res.status(200).json({ data: address });
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
}

export async function getAllAddress(req: Request, res: Response) {
  try {
    /*
#swagger.tags=['Address']
#swagger.parameters['authorization']={
  in:"header",
  required:'true'
}
*/
    const user = await userModel.findOne({ _id: req.user._id })
    const addresses = await AddressModel.find({ user_id: user?.id })
    res.json({ data: addresses })
  } catch (err) {
    res.status(500).json(JSON.stringify(err));
  }
}
export async function createAddress(req: Request, res: Response) {
  /*
  #swagger.tags = ['Address']
  #swagger.parameters['authorization'] = {
    in: "header",
    required: true
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      flat_house_no: "string",
      area_colony_street: "string",
      address: "string",
      country: "string",
      city: "string",
      state: "string",
      mobile_no: "string",
      user_id: "string",
      isDefault: "boolean",
      pincode: "string",
      bussinessId: "string",
      coordinates: {
        lat: "number",
        long: "number"
      }
    }
  }
  */
  try {
    const {
      flat_house_no,
      area_colony_street,
      address,
      country,
      city,
      state,
      mobile_no,
      user_id,
      isDefault,
      pincode,
      bussinessId,
      coordinates = {},
    } = req.body;

    let userDoc;
    if (req.user.role === "ADMIN" && user_id) {
      userDoc = await userModel.findOne({ _id: user_id });
    } else {
      userDoc = await userModel.findOne({ _id: req.user._id });
    }

    if (!userDoc) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }

    const addressDoc = await AddressModel.create({
      flat_house_no,
      area_colony_street,
      address,
      country,
      city,
      state,
      mobile_no,
      user_id: user_id || userDoc._id,
      isDefault,
      pincode,
      bussinessId,
      coordinates,
    });

    await userDoc.updateOne({ $push: { addresess: addressDoc._id } });

    logger.info(
      addressMessages.ADDRESS_ADDED_SUCCESSFULLY.message + req.originalUrl
    );

    res.status(201).json({ data: { addressDoc } });
  } catch (error: any) {
    logger.error("Error creating address: " + error.message + req.originalUrl);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function updateAddress(req: Request, res: Response) {
  /*
  #swagger.tags = ['Address']
  #swagger.summary = 'Update Address'
  #swagger.parameters['authorization'] = {
    in: "header",
    required: true
  },
  #swagger.parameters['addressId'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
      flat_house_no: "string",
      area_colony_street: "string",
      address: "string",
      country: "string",
      city: "string",
      state: "string",
      mobile_no: "string",
      user_id: "string",
      isDefault: "boolean",
      pincode: "string",
      bussinessId: "string",
      coordinates: {
        lat: "number",
        long: "number"
      }
    }
  }
  */

  try {
    const addressId = req.params.addressId;
    const {
      flat_house_no,
      area_colony_street,
      address,
      country,
      city,
      state,
      mobile_no,
      user_id,
      isDefault,
      pincode,
      coordinates,
    } = req.body;

    const addressFound = await AddressModel.findById(addressId);

    if (!addressFound) {
      logger.error(addressErrors.ADDRESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, addressErrors.ADDRESS_NOT_FOUND);
      return;
    }

    if (
      req.user.role !== "ADMIN" &&
      String(addressFound.user_id) !== (String(user_id) || String(req.user._id))
    ) {
      logger.error(addressErrors.UNAUTHORIZED_USER.error + req.originalUrl);
      sendError(res, addressErrors.UNAUTHORIZED_USER);
      return;
    }

    addressFound.flat_house_no = flat_house_no || addressFound.flat_house_no;
    addressFound.area_colony_street =
      area_colony_street || addressFound.area_colony_street;
    addressFound.address = address || addressFound.address;
    addressFound.country = country || addressFound.country;
    addressFound.city = city || addressFound.city;
    addressFound.state = state || addressFound.state;
    addressFound.mobile_no = mobile_no || addressFound.mobile_no;
    addressFound.user_id = user_id || addressFound.user_id;
    addressFound.pincode = pincode || addressFound.pincode;

    //todo
    addressFound.isDefault =
      !isDefault ? addressFound.isDefault : isDefault;
    addressFound.businessId =
      (req.user.businessId as any) || addressFound.businessId;
    addressFound.coordinates = {
      lat: coordinates?.lat || addressFound.coordinates.lat,
      long: coordinates?.long || addressFound.coordinates.long,
    };

    await addressFound.save();

    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId },
      { new: true }
    );

    logger.info(
      addressMessages.ADDRESS_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { updatedAddress } });
  } catch (error: any) {
    logger.error("Error updating address: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteAddress(req: Request, res: Response) {
  /*
  #swagger.tags = ['Address']
  #swagger.summary = 'Delete Address By AddressId'
  #swagger.parameters['authorization'] = {
    in: "header",
    required: true
  }
  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  */
  try {
    const id = req.params.id;
    let addressDoc;

    if (req.user.role === "ADMIN") {
      addressDoc = await AddressModel.findByIdAndDelete(id);
    } else {
      const user = await userModel
        .findOne({ _id: req.user._id })
        .populate("addresess");

      if (!user) {
        logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
        sendError(res, userErrors.USER_NOT_FOUND);
        return;
      }

      addressDoc = user.addresess.find(
        (address: any) => address._id.toString() === id
      );

      if (!addressDoc) {
        logger.error(addressErrors.ADDRESS_NOT_FOUND.error + req.originalUrl);
        sendError(res, addressErrors.ADDRESS_NOT_FOUND);
        return;
      }

      user.addresess = user.addresess.filter(
        (address: any) => address._id.toString() !== id
      );

      await user.save();
    }

    if (addressDoc) {
      await AddressModel.findByIdAndDelete(id);
    }

    logger.info(
      addressMessages.ADDRESS_DELETED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { message: "Address deleted successfully" } });
    return;
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error });
  }
}
