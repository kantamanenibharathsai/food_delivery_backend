import mongoose from "mongoose";

interface IAddress {
  _id: mongoose.Types.ObjectId;
  flat_house_no: string;
  area_colony_street: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  mobile_no: string;
  user_id: mongoose.Types.ObjectId;
  isDefault: boolean;
  businessId: mongoose.Types.ObjectId;
  landmark: string;
  coordinates: {
    lat: number;
    long: number;
  };
}

const AddressSchema: mongoose.Schema = new mongoose.Schema<IAddress>(
  {
    flat_house_no: {
      type: String,
      required: false,
    },
    area_colony_street: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    landmark: {
      type: String,
      required: false,
    },
    coordinates: {
      lat: {
        type: Number,
        required: false,
      },
      long: {
        type: Number,
        required: false,
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const AddressModel: mongoose.Model<IAddress> = mongoose.model<IAddress>(
  "address",
  AddressSchema
);

export default AddressModel;
