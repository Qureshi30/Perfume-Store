import express from 'express';
import { addProduct, getAllProducts, deleteProduct } from '../controllers/productController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/add-product', upload.single('image'), addProduct);
router.get('/get-products', getAllProducts);
router.delete('/delete-product/:id', deleteProduct);

export default router;
