import mongoose from "mongoose";

export interface IImage {
    _id: mongoose.Types.ObjectId;
    imageName: string;
    mimetype: string;
    destination_name: string
}

const ImgaeSchema: mongoose.Schema = new mongoose.Schema<IImage>(
    {
        imageName: {
            type: String,
            required: true,
        },
        mimetype: {
            type: String,
            required: false
        },
        destination_name: {
            type: String,
            required: false
        }
    },
    { timestamps: true, versionKey: false }
);

const ImageModel: mongoose.Model<IImage> = mongoose.model<IImage>(
    "image",
    ImgaeSchema
);

export default ImageModel;
