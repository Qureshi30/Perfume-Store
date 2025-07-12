import mongoose from "mongoose";

const ShoppingCartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    productId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String
    },
    altText: {
        type: String
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    hasImage: {
        type: Boolean,
        default: false
    }
});

// Create a compound index for faster lookups
ShoppingCartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('shoppingcart', ShoppingCartSchema);