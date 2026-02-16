import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// GET /api/cart  → get current user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      // return empty cart shape
      return res.json({ userId, items: [] });
    }

    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

// POST /api/cart/add  → add item to cart
// body: { productId, quantity }
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

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
      const item = cart.items.find((i) => i.productId.toString() === productId);

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    const populated = await cart.populate("items.productId");

    res.json({ message: "Item added to cart", cart: populated });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// PUT /api/cart/update  → change quantity
// body: { productId, quantity }
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "productId and numeric quantity are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    if (quantity <= 0) {
      // remove if quantity <= 0
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await cart.populate("items.productId");

    res.json({ message: "Cart updated", cart: populated });
  } catch (err) {
    console.error("Update cart error:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// DELETE /api/cart/remove  → remove one item
// body: { productId }
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    await cart.save();
    const populated = await cart.populate("items.productId");

    res.json({ message: "Item removed", cart: populated });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// DELETE /api/cart/clear  → clear whole cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ message: "Cart already empty" });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
