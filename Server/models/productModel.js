import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true,
        default: 'Lelido'
    },
    altText: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);
