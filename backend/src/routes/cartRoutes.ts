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

// GET current user's cart
router.get("/", protect, getCart);

// Add item
router.post("/add", protect, addToCart);

// Update quantity
router.put("/update", protect, updateCartItem);

// Remove single item
router.delete("/remove", protect, removeCartItem);

// Clear entire cart
router.delete("/clear", protect, clearCart);

export default router;
