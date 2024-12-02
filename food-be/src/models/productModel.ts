import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    category: string;
    categoryId: mongoose.Types.ObjectId;
    subCategoryId: mongoose.Types.ObjectId;
    subCategory: string;
    displayImage: string;
    images: [string];
    price: number;
    weight: number;
    discountPrice: number;
    quantity: number;
    units: string;
    isActive: boolean;
    businessId: mongoose.Types.ObjectId;
    packingCharge: number;
    sizes: string[];
    isTodaySpecial: boolean;
    specialDayDate: Date;
    isBestChoice: boolean;
}

const ProductSchema: Schema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'category'
    },
    images: {
        type: [String],
        required: true
    },
    subCategory: {
        type: String,
        required: false
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'subcategory'
    },
    displayImage: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    units: {
        type: String,
        required: true
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'business'
    },
    discountPrice: {
        type: Number,
        required: false
    },
    weight: {
        type: Number,
        required: false
    },

    isActive: {
        type: Boolean,
        default: true
    },
    packingCharge: {
        type: Number,
        required: false
    },
    sizes: {
        type: [String],
        required: false
    },
    isTodaySpecial: {
        type: Boolean,
        default: false
    },
    specialDayDate: {
        type: Date,
        default: null
    },
    isBestChoice: {
        type: Boolean,
        default: false
    },

}, { timestamps: true, versionKey: false });

const productModel: Model<IProduct> = mongoose.model<IProduct>('product', ProductSchema);

export default productModel