import mongoose, { Schema, model } from "mongoose";

export interface Ireview {
  reviewerId: mongoose.Types.ObjectId;
  rating: number;
  description: string;
  status: boolean;
  images: string[];
  restaurantId: mongoose.Types.ObjectId;
}

const reviewSchema = new Schema<Ireview>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [],
      ref: "image",
      required: false,
    },
    restaurantId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "business",
    },
  },
  { versionKey: false, timestamps: true }
);

const reviewModel = model<Ireview>("review", reviewSchema);
export default reviewModel;
