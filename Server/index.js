import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

import shoppingCartRoutes from "./routes/shoppingCartRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import imageRoutes from "./routes/imageRoutes.js"
// import adminRoutes from "./routes/adminRoutes.js"

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(bodyParser.urlencoded({ extended: true }));
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory at:', uploadsDir);
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving uploads from:', path.join(__dirname, 'uploads'));
app.use(express.static(path.join(__dirname, 'public')));

const connectdb = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return false;
    }
};

// Start server
const startServer = async () => {
    await connectdb();

    // Setup routes
    app.use("/api/shopping-cart", shoppingCartRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api", imageRoutes);
    // app.use("/api/admin", adminRoutes);

    // Global error handler - must be after all routes
    app.use(errorHandler);

    // 404 handler for undefined routes
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found"
        });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server listening on port: ${PORT}`);
    });
};

startServer();
