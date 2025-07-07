import express from 'express';
import { addToCart, getCart, deleteFromCart } from '../controllers/shoppingCartController.js';

const router = express.Router();


router.post('/add-to-cart', addToCart);
router.get('/get-cart', getCart);
router.post('/delete-from-cart/:id', deleteFromCart);



export default router;