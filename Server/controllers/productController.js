import ProductModel from "../models/productModel.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, description, price } = req.body;

        // Validate required fields
        if (!productName || !description || !price || !req.file) {
            return res.status(400).json({
                status: false,
                message: "Please provide all required fields including an image"
            });
        }

        // Get the latest product to determine the next ID
        const latestProduct = await ProductModel.findOne().sort({ productId: -1 });
        const nextProductId = latestProduct ? latestProduct.productId + 1 : 1;

        // Create image URL
        const imageUrl = `/uploads/${req.file.filename}`;

        // Create the product
        const product = await ProductModel.create({
            productId: nextProductId,
            productName,
            description,
            price: Number(price),
            imageUrl,
            altText: productName,
            brand: 'Lelido'
        });

        res.status(201).json({
            status: true,
            message: 'Product added successfully',
            product
        });
    } catch (error) {
        console.error("Product addition error:", error);
        res.status(500).json({
            status: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: true,
            products
        });
    } catch (error) {
        console.error("Product fetch error:", error);
        res.status(500).json({
            status: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.findOneAndDelete({ productId: Number(id) });
        res.status(200).json({
            status: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error("Product deletion error:", error);
        res.status(500).json({
            status: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};
