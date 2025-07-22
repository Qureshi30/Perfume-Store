import mongoose from 'mongoose';
import ShoppingCartModel from "../models/shoppingCartModel.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, title, price, imageUrl, quantity = 1 } = req.body;

        if (!userId || !productId || !title || !price) {
            return res.status(400).json({
                success: false,
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

        // Create new cart item
        const newCartItem = new ShoppingCartModel({
            userId,
            productId,
            title,
            price,
            imageUrl,
            quantity
        });

        await newCartItem.save();

        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            item: newCartItem
        });
    } catch (error) {
        console.error("Cart addition error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        });
    }
}

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await ShoppingCartModel.find({ userId });

        if (!cart || cart.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Cart is empty',
                cart: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Cart successfully retrieved",
            cart
        });

    } catch (error) {
        console.error("Cart retrieval error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve cart',
            error: error.message
        });
    }
}

export const deleteFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Product ID are required"
            });
        }

        const result = await ShoppingCartModel.deleteOne({
            userId,
            productId
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product successfully removed from cart"
        });
    } catch (error) {
        console.error("Cart deletion error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart',
            error: error.message
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Product ID are required"
            });
        }

        if (!quantity || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        const cartItem = await ShoppingCartModel.findOne({ userId, productId });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            item: cartItem
        });
    } catch (error) {
        console.error("Update quantity error:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to update item quantity',
            error: error.message
        });
    }
};
