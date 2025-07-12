import express from 'express';
import { uploadImage, getImage, getImageByProductId } from '../controllers/imageController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { processUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Image routes
router.post('/upload-image', isAuthenticated, processUpload, (req, res) => {
    if (req.savedImage) {
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            imageId: req.savedImage.imageId,
            filePath: req.savedImage.filePath
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'No image was uploaded'
        });
    }
});

router.get('/get-image', isAuthenticated, getImage);
router.get('/get-image/:productId', getImageByProductId); // No auth required for product images

export default router;
