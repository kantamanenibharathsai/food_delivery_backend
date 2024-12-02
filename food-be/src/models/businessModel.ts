import mongoose, { Document, Model, Schema } from "mongoose"
export interface IBusiness {
    ownerId: mongoose.Schema.Types.ObjectId,
    businessName: string,
    ownerName: string
    address: mongoose.Schema.Types.ObjectId
    gstNo: string
    email: string
    image?: string

    accountCompleted: boolean,
    coordinates: {
        latitude: number,
        longitude: number
    },
    location: {
        type: string,
        coordinates: [number, number]
    }
}

// create a schema using above type

export const businessSchema = new Schema<IBusiness>({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    businessName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    gstNo: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    accountCompleted: {
        type: Boolean,
        default: false
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {
    versionKey: false,
    timestamps: true,
})

businessSchema.index({ location: "2dsphere" })

const businessModel: Model<IBusiness> = mongoose.model<IBusiness>("business", businessSchema);

export default businessModel;