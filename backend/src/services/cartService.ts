import { Types } from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* =========================
   GET CART
========================= */
export const getCart = async (userId: Types.ObjectId) => {
  const cart = await Cart.findOne({ userId })
    .populate("items.productId")
    .lean();

  if (!cart) {
    return { userId, items: [] };
  }

  return cart;
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (
  userId: Types.ObjectId,
  productId: string,
  quantity: number = 1,
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [
        {
          productId: new Types.ObjectId(productId),
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();
  }

  return Cart.findOne({ userId })
    .populate("items.productId")
    .lean();
};

/* =========================
   UPDATE CART ITEM
========================= */
export const updateCartItem = async (
  userId: Types.ObjectId,
  productId: string,
  quantity: number,
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (i) => i.productId.toString() === productId,
  );

  if (!item) throw new Error("Item not in cart");

  if (quantity <= 0) {
    cart.items.pull({ productId });
  } else {
    item.quantity = quantity;
  }

  await cart.save();

  return Cart.findOne({ userId })
    .populate("items.productId")
    .lean();
};

/* =========================
   REMOVE CART ITEM
========================= */
export const removeCartItem = async (
  userId: Types.ObjectId,
  productId: string,
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  cart.items.pull({ productId });

  await cart.save();

  return Cart.findOne({ userId })
    .populate("items.productId")
    .lean();
};

/* =========================
   CLEAR CART
========================= */
export const clearCart = async (userId: Types.ObjectId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return;

  cart.items.splice(0);
  await cart.save();
};
