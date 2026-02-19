import { Request, Response } from "express";
import {
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  removeCartItem as removeCartItemService,
  clearCart as clearCartService,
} from "../services/cartService.js";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const cart = await getCartService(userId);

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await addToCartService(userId, productId, quantity);

    res.json({ message: "Item added to cart", cart });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({
        message: "productId and numeric quantity required",
      });
    }

    const cart = await updateCartItemService(userId, productId, quantity);

    res.json({ message: "Cart updated", cart });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await removeCartItemService(userId, productId);

    res.json({ message: "Item removed", cart });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    await clearCartService(userId);

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
