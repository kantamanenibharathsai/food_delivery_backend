import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  category: string;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  image?: string;
  startingPrice: number;
  resturantId: string;
  sellerId: string;
}
const subCategorySchema: Schema = new Schema<ISubCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    startingPrice: {
      type: Number,
    },
    resturantId: {
      type: String,
    },
    sellerId: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

const subCategoryModel: Model<ISubCategory> = mongoose.model<ISubCategory>(
  "subcategory",
  subCategorySchema
);

export default subCategoryModel;
