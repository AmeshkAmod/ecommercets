import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

// GET current user's cart
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     description: Returns the cart of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getCart);

// Add item
/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     description: Add a product to the user's cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item added to cart
 *       401:
 *         description: Unauthorized
 */
router.post("/add", protect, addToCart);

// Update quantity

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     description: Update the quantity of an item in the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated
 *       401:
 *         description: Unauthorized
 */
router.put("/update", protect, updateCartItem);

// Remove single item
/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     description: Remove a specific product from the cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 */
router.delete("/remove", protect, removeCartItem);

// Clear entire cart
/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     description: Remove all items from the user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear", protect, clearCart);

export default router;
