import mongoose from "mongoose";

interface IBankDetails {
  accountHolderName: string;
  accountNo: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
  businessId: mongoose.Types.ObjectId;
  isActive: boolean;
  isBusiness: boolean;
}

const bankDetailsSchema = new mongoose.Schema<IBankDetails>(
  {
    accountHolderName: {
      type: String,
      required: false,
    },
    accountNo: {
      type: String,
      required: false,
    },
    ifscCode: {
      type: String,
      required: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    upiId: {
      type: String,
      required: false,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBusiness: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const bankDetailsModel = mongoose.model<IBankDetails>(
  "bankdetails",
  bankDetailsSchema
);

export default bankDetailsModel;
