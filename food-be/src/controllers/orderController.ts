import { Request, Response } from "express";
import userModel from "../models/userModel";
import orderModel from "../models/orderModel";
import logger from "../loggers/logger";
import productModel from "../models/productModel";
import AddressModel from "../models/addressModel";
import { addressErrors, productErrors } from "../utils/Errors/commonErrors";
import { sendError } from "../middlewares/errorHanlder";
import phonePayConfig from "../config/phonePayPg";
import sha256 from "sha256";
import { orderErrors } from "../utils/Errors/commonErrors";
import { orderSuccessMessages } from "../utils/successMessages/successMessages";
import { v4 as uuid } from "uuid";
import paymentModel, { paymentI } from "../models/paymentModel";
import { paymentErrors } from "../utils/Errors/commonErrors";
import {
  checkTransactionStatus,
  paymentRefund,
} from "../handlers/phonePayHandler";

export async function createOrder(req: Request, res: Response) {
  /*
  #swagger.tags = ['orders']
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    type: 'object',
    schema: {
      productId: {
        type: 'string'
      },
      addressId: {
        type: 'string'
      },
      quantity: {
        type: 'integer'
      }
    }
  }
  */
  try {
    const { productId, addressId, quantity } = req.body;
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND, 404);
      return;
    }
    const userDoc = await userModel
      .findOne({ _id: req.user._id })
      .populate("addresess");
    const address = userDoc?.addresess?.find(
      (address: any) => address._id.toString() === addressId
    );
    if (!address) {
      logger.error(addressErrors.ADDRESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, addressErrors.ADDRESS_NOT_FOUND, 404);
      return;
    }
    if (product.quantity < quantity) {
      logger.error(productErrors.INSUFFICIENT_STOCK.error + req.originalUrl);
      sendError(res, productErrors.INSUFFICIENT_STOCK, 400);
      return;
    }

    const order = await orderModel.create({
      products: [productId],
      addresses: [addressId],
      quantity: quantity,
      totalAmount: product.price * quantity,
      userId: req.user._id,
      orderStatus: "CREATED",
      orderType: "NORMAL",
    });

    const updatedOrder = await orderModel
      .findById(order._id)
      .populate("products")
      .populate("addresses")
      .populate("userId");

    res.status(200).json({ data: updatedOrder });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error: error });
  }
}

export async function placeOrder(req: Request, res: Response) {
  /*
  #swagger.tags = ['orders']
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    type: 'object',
    schema: {
      orderId: {
        type: 'string'
      }
    }
  }
   */
  try {
    const { orderId } = req.body;
    const orderDoc = await orderModel.findOne({ _id: orderId });

    if (!orderDoc) {
      logger.error(`${orderErrors.ORDER_NOT_FOUND.error} ${req.originalUrl}`);
      sendError(res, orderErrors.ORDER_NOT_FOUND);
      return;
    }

    const payEndPoint = "/pg/v1/pay";

    const merchantTransactionId = uuid();
    const normalPayLoad = {
      merchantId: phonePayConfig.merchantId,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: req.user._id,
      amount: orderDoc.totalAmount * 100,
      // redirectUrl: `http://localhost:${process.env.PORT}/orders/status/${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      mobileNumber: req.user.mobile_no,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64EncodedPayload = Buffer.from(
      JSON.stringify(normalPayLoad),
      "utf8"
    ).toString("base64");

    const xVerifyChecksum =
      sha256(base64EncodedPayload + payEndPoint + phonePayConfig.saltKey) +
      "###" +
      phonePayConfig.saltIndex;

    await orderDoc.updateOne({ merchantTransactionId: merchantTransactionId });
    res.status(200).json({
      data: normalPayLoad,
      xVerify: xVerifyChecksum,
      base64EncodedPayload,
    });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).send(error);
  }
}

export async function checkPaymentStatus(req: Request, res: Response) {
  /*
  #swagger.tags = ['orders']
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true,
    type: 'string'
  }
  #swagger.parameters['merchantTransactionId'] = {
    in: 'path',
    required: true,
    type: 'string'
  }
  */
  try {
    const { merchantTransactionId } = req.params;
    const orderDoc = await orderModel
      .findOne({ merchantTransactionId: merchantTransactionId })
      .populate("products")
      .populate("addresses")
      .populate("userId");
    if (!orderDoc) {
      logger.error(`${orderErrors.ORDER_NOT_FOUND.error} ${req.originalUrl}`);
      sendError(res, orderErrors.ORDER_NOT_FOUND);
      return;
    }
    const data = await checkTransactionStatus(merchantTransactionId);
    console.log(data);
    const paymentDoc = await paymentModel.create({
      merchantId: data.merchantId,
      merchantTransactionId: data.merchantTransactionId,
      amount: data.amount,
      state: data.state,
      responseCode: data.responseCode,
      paymentInstrument: {
        type: data.paymentInstrument.type,
        cardType: data.paymentInstrument.cardType,
        pgTransactionId: data.paymentInstrument.pgTransactionId,
        bankTransactionId: data.paymentInstrument.bankTransactionId,
        pgAuthorizationCode: data.paymentInstrument.pgAuthorizationCode,
        arn: data.paymentInstrument.arn,
        bankId: data.paymentInstrument.bankId,
        brn: data.paymentInstrument.brn,
      },
      orderId: orderDoc?._id,
      paymentMode: data.paymentInstrument.type,
      userId: orderDoc?.userId,
    });
    await orderDoc?.updateOne({
      paymentMode: data.paymentInstrument.type,
      orderStatus: data.state,
    });
    const orderDetails = await orderModel
      .findById(orderDoc?._id)
      .populate("products")
      .populate("addresses");
    res.status(200).json({ data: { paymentDoc, orderDetails } });
    return;
  } catch (error: any) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

//InProgress
export async function refundOrder(req: Request, res: Response) {
  try {
    const { merchantTransactionId } = req.params;
    const paymentDoc = await paymentModel.findOne({
      merchantTransactionId: merchantTransactionId,
    });
    if (!paymentDoc) {
      sendError(res, paymentErrors.PAYMENT_NOT_FOUND);
      return;
    }
    let payload = {
      merchantId: phonePayConfig.merchantId as string,
      originalTransactionId: paymentDoc.paymentInstrument.pgTransactionId,
      amount: paymentDoc.amount,
    };
    const refundData = await paymentRefund(payload);

    if (refundData.success === false) {
      sendError(res, refundData);
      return;
    }

    console.log(refundData.responseCode);
    res.status(200).json(refundData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}
