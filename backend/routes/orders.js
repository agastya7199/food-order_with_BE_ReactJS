import express from 'express';
import { createOrder, getUserOrders } from '../controllers/ordersController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);

export default router;

