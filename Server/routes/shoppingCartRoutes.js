import express from 'express';
import { addToCart, getCart, deleteFromCart, updateQuantity } from '../controllers/shoppingCartController.js';
import { isAuthenticated, isResourceOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes with authentication
router.post('/add-to-cart', isAuthenticated, addToCart);
router.get('/get-cart/:userId', isAuthenticated, isResourceOwner, getCart);
router.delete('/remove-from-cart/:userId/:productId', isAuthenticated, isResourceOwner, deleteFromCart);
router.put('/update-quantity/:userId/:productId', isAuthenticated, isResourceOwner, updateQuantity);

export default router;