import mongoose, { Schema, model } from "mongoose";

export interface paymentI {
  merchantId: string;
  merchantTransactionId: string;
  amount: number;
  state: string;
  responseCode: string;
  paymentInstrument: {
    type: string;
    cardType: string;
    pgTransactionId: string;
    bankTransactionId: null | any;
    pgAuthorizationCode: null | any;
    arn: string;
    bankId: null | any;
    brn: string;
  };
  orderId: mongoose.Types.ObjectId[];
  paymentMode: string;
  userId: mongoose.Types.ObjectId[];
}

const paymentSchema = new Schema<paymentI>(
  {
    merchantId: {
      type: String,
      required: true,
    },
    merchantTransactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    responseCode: {
      type: String,
      required: true,
    },
    paymentInstrument: {
      type: {
        type: String,
        required: true,
      },
      cardType: {
        type: String,
        required: false,
      },
      pgTransactionId: {
        type: String,
        required: false,
      },
      bankTransactionId: {
        type: String,
        required: false,
      },
      pgAuthorizationCode: {
        type: String,
        required: false,
      },
      arn: {
        type: String,
        required: false,
      },
      bankId: {
        type: String,
        required: false,
      },
      brn: {
        type: String,
        required: false,
      },
    },
    orderId: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "Order",
    },
    paymentMode: {
      type: String,
      required: true,
    },
    userId: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, versionKey: false }
);

const paymentModel = model<paymentI>("Payment", paymentSchema);
export default paymentModel;
