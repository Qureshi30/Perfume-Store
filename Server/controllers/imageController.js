import ImageModel from '../models/imageModel.js';

export const uploadImage = async (req, res) => {
    try {
        const { userId, productId, imageBase64 } = req.body;

        if (!userId || !imageBase64) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId and imageBase64 are required'
            });
        }

        // Validate the base64 string
        if (!imageBase64.startsWith('data:image/')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image format'
            });
        }

        // Create new image document
        const newImage = new ImageModel({
            userId,
            productId: productId || null,
            imageBase64
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            imageId: newImage._id
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while uploading image',
            error: error.message
        });
    }
};

export const getImage = async (req, res) => {
    try {
        const { userId, productId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameter: userId'
            });
        }

        const query = { userId };
        if (productId) {
            query.productId = productId;
        }

        const image = await ImageModel.findOne(query).sort({ createdAt: -1 });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(200).json({
            success: true,
            imageBase64: image.imageBase64,
            imageId: image._id
        });
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving image',
            error: error.message
        });
    }
};

export const getImageByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameter: productId'
            });
        }

        const image = await ImageModel.findOne({ productId }).sort({ createdAt: -1 });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found for this product'
            });
        }

        res.status(200).json({
            success: true,
            imageBase64: image.imageBase64,
            imageId: image._id
        });
    } catch (error) {
        console.error('Error retrieving product image:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while retrieving product image',
            error: error.message
        });
    }
};
