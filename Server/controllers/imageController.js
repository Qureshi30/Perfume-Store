import ImageModel from '../models/imageModel.js';

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const { userId, productId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: userId'
            });
        }

        // Create new image document
        const newImage = new ImageModel({
            userId,
            productId: productId || null,
            filename: req.file.filename,
            filePath: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: {
                imageId: newImage._id,
                filePath: newImage.filePath,
                filename: newImage.filename
            }
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

const getImage = async (req, res) => {
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
            image: {
                imageId: image._id,
                filePath: image.filePath,
                filename: image.filename
            }
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

const getImageByProductId = async (req, res) => {
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
            image: {
                imageId: image._id,
                filePath: image.filePath,
                filename: image.filename
            }
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


export { uploadImage, getImage, getImageByProductId };
