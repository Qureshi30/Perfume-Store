import mongoose from 'mongoose';
import ShoppingCartModel from "../models/shoppingCartModel.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, title, price, imageUrl, quantity = 1 } = req.body;

        if (!userId || !productId || !title || !price) {
            return res.status(400).json({
                status: false,
                message: "Missing required parameters"
            });
        }

        // Check if item already exists in cart
        const existingItem = await ShoppingCartModel.findOne({ userId, productId });

        if (existingItem) {
            // Update quantity if item exists
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.json({
                success: true,
                message: "Cart updated successfully",
                cart: existingItem
            });
        }

        // Validate and convert productId
        const numericProductId = Number(productId);
        if (isNaN(numericProductId)) {
            console.log('Invalid productId:', productId);
            return res.status(400).json({
                status: false,
                message: 'Invalid product ID format'
            });
        }

        // Convert and validate price
        const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
        if (isNaN(numericPrice)) {
            console.log('Invalid price value:', price);
            return res.status(400).json({
                status: false,
                message: 'Invalid price format'
            });
        }

        // Prepare the cart item with validated data
        const cartItem = {
            productId: numericProductId,
            title: String(title).trim(),
            description: String(description).trim(),
            price: numericPrice,
            brand: String(brand).trim()
        };

        console.log('Attempting to create cart item:', cartItem);

        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection is not ready');
        }

        const shoppingCart = await ShoppingCartModel.create(cartItem);
        console.log('Successfully created cart item:', shoppingCart);

        res.status(200).json({
            status: true,
            message: 'Product added to cart successfully',
            item: shoppingCart
        });
    } catch (error) {
        console.error("Cart addition error:", {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });

        // Send a more informative error response
        res.status(500).json({
            status: false,
            message: 'Failed to add item to cart',
            error: error.message,
            details: error.code === 11000 ? 'Duplicate item' : 'Database error'
        });

    }
}

export const getCart = async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection is not ready');
        }

        const cart = await ShoppingCartModel.find();

        if (!cart || cart.length === 0) {
            return res.status(200).json({
                status: true,
                message: 'Cart is empty',
                cart: []
            });
        }

        res.status(200).json({
            status: true,
            message: "Cart successfully retrieved",
            cart
        });

    } catch (error) {
        console.error("Cart retrieval error:", {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        res.status(500).json({
            status: false,
            message: 'Failed to retrieve cart',
            error: error.message
        });
    }
}
export const deleteFromCart = async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database connection is not ready');
        }

        const { id } = req.params;
        console.log('Product ID to delete:', id);

        // Check if ID is present
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Product ID is required"
            });
        }

        // Convert and validate ID
        const productId = Number(id);
        if (isNaN(productId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid product ID format"
            });
        }

        // Perform deletion using deleteOne
        const result = await ShoppingCartModel.deleteOne({ productId });

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                status: false,
                message: "Product not found in cart"
            });
        }

        // Successful deletion
        res.status(200).json({
            status: true,
            message: "Product successfully removed from cart",
            deletedId: productId
        });
    } catch (error) {
        console.error("Cart deletion error:", {
            message: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack
        });
        res.status(500).json({
            status: false,
            message: 'Failed to remove item from cart',
            error: error.message
        });
    }
};
