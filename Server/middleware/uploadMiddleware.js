import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import ImageModel from '../models/imageModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure uploads directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create a unique filename while preserving the original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Save to MongoDB after file is saved to disk
const saveToMongoDB = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Read the file we just saved
        const filePath = path.join(req.file.destination, req.file.filename);
        const fileContent = await fs.promises.readFile(filePath);
        const base64Image = `data:${req.file.mimetype};base64,${fileContent.toString('base64')}`;

        // Save to MongoDB
        const image = new ImageModel({
            userId: req.body.userId,
            productId: req.body.productId,
            imageBase64: base64Image,
            filePath: `/uploads/${req.file.filename}` // Store the relative path
        });

        await image.save();

        // Add the saved image info to the request
        req.savedImage = {
            filePath: `/uploads/${req.file.filename}`,
            imageId: image._id
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

export const processUpload = [upload.single('image'), saveToMongoDB];
