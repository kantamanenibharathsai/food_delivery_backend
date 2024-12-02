import mongoose from "mongoose";

interface IBestOffer {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  isActive: boolean;
  image: string;
  offerName: string;
  description: string;
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId;
      isActive: boolean;
      originalPrice: number;
      offerPrice: number;
    }
  ];
  categoryId: mongoose.Types.ObjectId;
}

const bestOfferSchema = new mongoose.Schema<IBestOffer>(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
    },
    image: {
      type: String,
    },
    offerName: {
      type: String,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
          isActive: Boolean,
          originalPrice: Number,
          offerPrice: Number,
        },
      ],
      default: [],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  { timestamps: true, versionKey: false }
);

const bestOfferModel = mongoose.model<IBestOffer>("bestoffer", bestOfferSchema);

export default bestOfferModel;
