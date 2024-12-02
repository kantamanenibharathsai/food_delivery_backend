import mongoose, { Schema, model } from "mongoose";
import { orderStatus, paymentType } from "../types/commonTypes";

type OrderType = "CART" | "NORMAL";

interface IOrder {
  _id: mongoose.Schema.Types.ObjectId;
  discountPrice: number;
  orderStatus: orderStatus;
  orderType: OrderType;
  totalAmount: number;
  paymentMode: paymentType;
  quantity: number;
  products: mongoose.Types.ObjectId[];
  addresses: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  merchantTransactionId: string[];
}

const orderSchema = new Schema<IOrder>(
  {
    discountPrice: {
      type: Number,
      required: false,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["CART", "NORMAL"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    products: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
      required: true,
    },
    addresses: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    merchantTransactionId: {
      type: [String],
      required: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const orderModel = model<IOrder>("Order", orderSchema);
export default orderModel;
