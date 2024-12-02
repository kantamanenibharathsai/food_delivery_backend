import mongoose, { Model, Schema } from "mongoose";

export type role = "ADMIN" | "CUSTOMER" | "SELLER";

export type cartItem = {
  cartItem: mongoose.Schema.Types.ObjectId,
  quantity: number
}

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  country_code?: string;
  mobile_no?: string;
  gender?: string;
  role: role;
  password: string;
  verified: boolean;
  fcm_token?: string;
  profile_url?: string;
  date_of_birth?: Date;
  cart_id?: number;
  language?: string;
  verify_otp?: string;
  verify_otp_time?: Date;
  removed: boolean;
  isActive: boolean;
  state?: string;
  businessId?: mongoose.Schema.Types.ObjectId;
  addresess: mongoose.Schema.Types.ObjectId[];
  cart: { products: cartItem[], totalPrice: number };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    country_code: {
      type: String,
      required: false,
    },
    mobile_no: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    role: {
      type: String,
      required: false,
      enum: ["ADMIN", "SELLER", "CUSTOMER"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    fcm_token: {
      type: String,
      required: false,
    },
    profile_url: {
      type: String,
      required: false,
    },
    date_of_birth: {
      type: Date,
      required: false,
    },
    cart_id: {
      type: Number,
      required: false,
    },
    language: {
      type: String,
      required: false,
    },
    verify_otp: {
      type: String,
      required: false,
    },
    verify_otp_time: {
      type: Date,
      required: false,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    state: {

      type: String,
      required: false,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      required: false,
    },
    addresess: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "address",
      required: false,
    },
    cart: {
      type: {
        products: {
          type: [{ cartItem: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, quantity: Number }],
          default: []
        },
        totalPrice: {
          type: Number,
          default: 0
        }
      },

    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;
