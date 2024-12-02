import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description?: string;
    image?: string;

}

const CategorySchema: Schema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true, versionKey: false });

const Category: Model<ICategory> = mongoose.model<ICategory>('category', CategorySchema);

export default Category;
