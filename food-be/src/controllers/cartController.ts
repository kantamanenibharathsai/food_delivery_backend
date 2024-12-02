import { Request, Response } from "express";
import { uploadFiles } from "../libraries/minioLib";
import { ExceptionHandler } from "winston";
import { sendError } from "../middlewares/errorHanlder";
import productModel, { IProduct } from "../models/productModel";
import {
  addressErrors,
  cartErros,
  productErrors,
  userErrors,
} from "../utils/Errors/commonErrors";
import userModel, { cartItem } from "../models/userModel";
import { updateUser } from "./userControllers";
import orderModel from "../models/orderModel";
import logger from "../loggers/logger";
import {
  cartMessages,
  orderSuccessMessages,
} from "../utils/successMessages/successMessages";
import { isValidObjectId } from "mongoose";

export async function addToCart(req: Request, res: Response) {
  /*
    #swagger.tags = ['UserCart']
    #swagger.summary='Add item to cart'
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
        productId:'string',
        quantity:'integer'
      }
    }
    */
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }

    const cartItem = req.user?.cart?.products?.find(
      (item) => item.cartItem == productId
    );

    if (cartItem) {
      const updatedCart = await userModel
        .findOne({ _id: req.user._id }, { cart: 1 })
        .populate("cart.products.cartItem");
      logger.info(cartMessages.ITEM_ADDED_TO_CART.message + req.originalUrl);
      res.json({ success: true, cart: updatedCart?.cart });
      return;
    }
    let totalPrice = cartTotalPrice(req.user?.cart?.products as any) || 0;
    const addObj = {
      cartItem: product._id,
      quantity,
    };
    let user = await userModel.findOne({ _id: req.user._id });
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }
    if (!user.cart) {
      await user.updateOne({ cart: { products: [], totalPrice: 0 } });
      const updatedUser = await userModel.findOne({ _id: user._id });
      if (updatedUser) {
        user = updatedUser;
      }
    }
    user?.cart.products.push(addObj);
    user.cart.totalPrice += totalPrice + product.price * quantity;
    await user?.save();
    const updatedCart = await userModel
      .findOne({ _id: req.user._id }, { cart: 1 })
      .populate("cart.products.cartItem");

    logger.info(cartMessages.ITEM_ADDED_TO_CART.message + req.originalUrl);
    res.json({ success: true, cart: updatedCart?.cart });
    return;
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function getCart(req: Request, res: Response) {
  /*
    #swagger.tags = ['UserCart']
    #swagger.summary='Get cart'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    */
  try {
    const user = await userModel
      .findOne({ _id: req.user._id })
      .populate("cart.products.cartItem");
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }
    logger.info(cartMessages.CART_FOUND_SUCCESSFULLY.message + req.originalUrl);
    res.json({ success: true, cart: user?.cart });
    return;
  } catch (error: any) {
    logger.error(error.message + req.originalUrl);
    res.status(500).json({ error: error.message });
  }
}

export async function removeCartItem(req: Request, res: Response) {
  /*
  #swagger.tags=['UserCart']
  #swagger.summary='Remove item from cart'
  #swagger.parameters['authorization']={
    in:'header',
    required:'true',
    type:'string'
  },
  #swagger.parameters['productId']={
    in:'path',
    required:'true',
    type:'string'
  }
  */
  try {
    const { productId } = req.params;
    if (productId && !isValidObjectId(productId)) {
      logger.error(productErrors.INVALID_PRODUCT_ID.error + req.originalUrl);
      sendError(res, productErrors.INVALID_PRODUCT_ID);
      return;
    }
    const user = await userModel.findOne({ _id: req.user._id });
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    if (!user) {
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }
    const productExists = user.cart.products.find(
      (item) => item.cartItem.toString() == productId
    );
    if (!productExists) {
      logger.error(cartErros.CART_NOT_FOUND.error + req.originalUrl);
      sendError(res, cartErros.CART_NOT_FOUND);
      return;
    }
    user.cart.products = user.cart.products.filter(
      (item) => item.cartItem.toString() != productId
    );
    user.cart.totalPrice -= productExists.quantity * product?.price;
    await user.save();
    const updatedCart = await userModel
      .findOne({ _id: req.user._id }, { cart: 1 })
      .populate("cart.products.cartItem");
    logger.info(cartMessages.ITEM_REMOVED_FROM_CART.message + req.originalUrl);
    res.json({ success: true, cart: updatedCart?.cart });
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

export async function addCartOrder(req: Request, res: Response) {
  /*
  #swagger.tags=['UserCart']
  #swagger.summary='Create cart order'
  #swagger.parameters['authorization']={
    in:'header',
    required:'true',
    type:'string'
  },
  #swagger.parameters['body']={
    in:'body',
    required:'true',
    schema:{
      addressId:"string"
    }
  }
  */
  try {
    const { addressId } = req.body;
    const user = await userModel
      .findOne({ _id: req.user._id })
      .populate("cart.products.cartItem")
      .populate("addresess");
    const cart = user?.cart;
    const address = user?.addresess.find(
      (item: any) => item._id.toString() === addressId
    );
    console.log("adress", address);
    if (!address) {
      logger.error(addressErrors.ADDRESS_NOT_FOUND.error + req.originalUrl);
      sendError(res, addressErrors.ADDRESS_NOT_FOUND);
      return;
    }
    if (!cart) {
      logger.error(cartErros.CART_NOT_FOUND.error + req.originalUrl);
      sendError(res, cartErros.CART_NOT_FOUND);
      return;
    }
    let totalAmount = cart.totalPrice;
    let totalQuantity = 0;
    cart?.products.forEach((product) => {
      totalQuantity += product.quantity;
    });

    const orderDoc = await orderModel.create({
      totalAmount: totalAmount,
      discountPrice: 0,
      orderStatus: "CREATED",
      orderType: "CART",
      quantity: totalQuantity,
      userId: user?._id,
      addresses: addressId,
    });

    for (let product of cart?.products) {
      const cartItem: any = product.cartItem;
      await orderDoc?.updateOne({ $push: { products: cartItem._id } });
    }
    logger.info(
      orderSuccessMessages.ORDER_PLACED_SUCCESSFULLY.message + req.originalUrl
    );
    const cartOrderDoc = await orderModel
      .findById(orderDoc._id)
      .populate("products")
      .populate("addresses");
    res.json({
      data: {
        order: cartOrderDoc,
      },
    });
  } catch (err: any) {
    logger.error(err.message + " route: " + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

export async function updateCart(req: Request, res: Response) {
  /*
  #swagger.tags = ['UserCart']
  #swagger.summary='Update cart'
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
      productId:'string',
      quantity: 'integer'
    }
  }
  */
  try {
    const { productId, quantity } = req.body;
    const user = await userModel.findOne({ _id: req.user._id });
    const product = await productModel.findOne({ _id: productId });
    if (!product) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }
    const productExists = user.cart.products.find(
      (item) => item.cartItem.toString() == productId
    );
    if (!productExists) {
      logger.error(productErrors.PRODUCT_NOT_FOUND.error + req.originalUrl);
      sendError(res, productErrors.PRODUCT_NOT_FOUND);
      return;
    }
    const userCart = await userModel
      .findOne({ _id: req.user._id })
      .populate("cart.products.cartItem");

    if (quantity == 0) {
      user.cart.products = user.cart.products.filter(
        (item) => item.cartItem.toString() != productId
      );
      user.cart.totalPrice -= productExists.quantity * product?.price;
    } else {
      user.cart.products = user.cart.products.map((item) => {
        if (item.cartItem.toString() == productId) {
          item.quantity = quantity;
        }
        return item;
      });
      await user.save();
      const userCart = await userModel
        .findOne({ _id: req.user._id }, { cart: 1 })
        .populate("cart.products.cartItem");
      user.cart.totalPrice = cartTotalPrice(userCart?.cart.products as any);
    }
    await user.save();
    const updatedCart = await userModel
      .findOne({ _id: req.user._id }, { cart: 1 })
      .populate("cart.products.cartItem");
    logger.info(
      cartMessages.CART_UPDATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.json({ success: true, cart: updatedCart?.cart });
    return;
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

export async function emptyCart(req: Request, res: Response) {
  /*
 #swagger.tags = ['UserCart']
 #swagger.summary='empty Cart'
 #swagger.parameters['authorization'] = {
   in: 'header',
   required: true,
   type: 'string'
 }
 */
  try {

    const user = await userModel.findOne({ _id: req.user._id })
    if (!user) {
      sendError(res, { error: "user not found" })
      return;
    }
    user.cart.products = [];
    user.cart.totalPrice = 0;

    await user.save();
    const updatedCart = await userModel
      .findOne({ _id: req.user._id }, { cart: 1 })

    logger.info(
      cartMessages.CLEANED_CART_SUCCESSFULLY.message + req.originalUrl
    );
    res.json({ success: true, cart: updatedCart?.cart });
    return;
  } catch (err: any) {
    logger.error(err.message + req.originalUrl);
    res.status(500).json({ error: err.message });
  }
}

interface productCartItem {
  cartItem: IProduct;
  quantity: number;
}
function cartTotalPrice(items: productCartItem[] | undefined) {
  if (items == undefined) {
    return 0;
  }
  let total = 0;
  items.forEach((item) => {
    total += item.cartItem.price * item.quantity;
  });
  return total;
}

