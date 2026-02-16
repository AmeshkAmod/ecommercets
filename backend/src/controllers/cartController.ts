import type { Request, Response } from "express";
import type { Types } from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

interface CartBody {
  productId?: string;
  quantity?: number;
}

interface CartItemShape {
  productId: Types.ObjectId;
  quantity: number;
}

const getUserId = (req: Request, res: Response): Types.ObjectId | null => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return null;
  }
  return req.user._id;
};

// GET /api/cart -> get current user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({ userId, items: [] });
    }

    return res.json(cart);
  } catch (err: unknown) {
    console.error("Get cart error:", err);
    return res.status(500).json({ message: "Failed to load cart" });
  }
};

// POST /api/cart/add -> add item to cart
export const addToCart = async (
  req: Request<Record<string, never>, unknown, CartBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const { productId } = req.body;
    const quantity = typeof req.body.quantity === "number" ? req.body.quantity : 1;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const item = (cart.items as unknown as CartItemShape[]).find(
        (cartItem: CartItemShape) => cartItem.productId.toString() === productId,
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json({ message: "Item added to cart", cart: populated });
  } catch (err: unknown) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PUT /api/cart/update -> change quantity
export const updateCartItem = async (
  req: Request<Record<string, never>, unknown, CartBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const { productId, quantity } = req.body;
    if (!productId || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "productId and numeric quantity are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = (cart.items as unknown as CartItemShape[]).find(
      (cartItem: CartItemShape) => cartItem.productId.toString() === productId,
    );
    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items = (cart.items as unknown as CartItemShape[]).filter(
        (cartItem: CartItemShape) => cartItem.productId.toString() !== productId,
      ) as unknown as typeof cart.items;
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json({ message: "Cart updated", cart: populated });
  } catch (err: unknown) {
    console.error("Update cart error:", err);
    return res.status(500).json({ message: "Failed to update cart" });
  }
};

// DELETE /api/cart/remove -> remove one item
export const removeCartItem = async (
  req: Request<Record<string, never>, unknown, CartBody>,
  res: Response,
) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = (cart.items as unknown as CartItemShape[]).filter(
      (item: CartItemShape) => item.productId.toString() !== productId,
    ) as unknown as typeof cart.items;

    await cart.save();
    const populated = await cart.populate("items.productId");
    return res.json({ message: "Item removed", cart: populated });
  } catch (err: unknown) {
    console.error("Remove cart item error:", err);
    return res.status(500).json({ message: "Failed to remove item" });
  }
};

// DELETE /api/cart/clear -> clear whole cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) {
      return;
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();
    return res.json({ message: "Cart cleared" });
  } catch (err: unknown) {
    console.error("Clear cart error:", err);
    return res.status(500).json({ message: "Failed to clear cart" });
  }
};
