import express from 'express';
import { adminStats, createOrder, listOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private (must be logged in)
 * 
 * HTML file calling this route:
 * - order.html  → fetch('/api/orders', { method: 'POST' })
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Create an order for the logged-in user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       401:
 *         description: Unauthorized
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

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get orders of the logged-in user
 *     tags: [Orders]
 *     description: Retrieve all orders placed by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, listOrders);

/**
 * @swagger
 * /orders/admin/stats:
 *   get:
 *     summary: Get admin order statistics
 *     tags: [Orders]
 *     description: Retrieve statistics for orders (admin use)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/admin/stats", protect, adminStats);

export default router;