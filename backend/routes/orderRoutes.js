import express from 'express';
import { createOrder, listOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private (must be logged in)
 * 
 * HTML file calling this route:
 * - order.html  → fetch('/api/orders', { method: 'POST' })
 */
router.post('/', protect, createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders of the logged-in user
 * @access  Private
 * 
 * HTML file calling this route:
 * - orders.html  → fetch('/api/orders')
 */
router.get('/', protect, listOrders);

export default router;