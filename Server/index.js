import express from 'express';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import cors from 'cors';

import shoppingCartRoutes from "./routes/shoppingCartRoutes.js"
import productRoutes from "./routes/productRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving uploads from:', path.join(__dirname, 'uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

const connectdb = async () => {
    try {
        await mongoose.connect("mongodb+srv://hassan:hassan@cluster0.5uq9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to MongoDB");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return false;
    }
};

// Simple error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

// Start server
const startServer = async () => {
    await connectdb();
    app.use("/api/shopping-cart", shoppingCartRoutes);
    app.use("/api/products", productRoutes);

    app.listen(4000, () => {
        console.log("Server listening on port: 4000");
    });
};

startServer();
