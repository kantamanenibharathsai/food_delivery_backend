import mongoose, { Schema, model } from "mongoose";

export interface ISearch {
  _id: mongoose.Types.ObjectId;
  search: string;
  userId: mongoose.Types.ObjectId;
}

const searchSchema = new Schema<ISearch>({
  search: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const searchModel = model<ISearch>("search", searchSchema);

export default searchModel;
