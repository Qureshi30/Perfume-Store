import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    productId: {
        type: String,
        index: true
    },
    imageBase64: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Automatically delete after 30 days
    }
});

// Create compound indexes for faster lookups
ImageSchema.index({ userId: 1, productId: 1 });
ImageSchema.index({ productId: 1, createdAt: -1 });

const ImageModel = mongoose.model("Image", ImageSchema);

export default ImageModel;
