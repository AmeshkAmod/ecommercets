import { Types } from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

interface CreateOrderDTO {
  userId: Types.ObjectId;
  items: any[];
  total: number;
  paymentMethod: string;
}

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async ({
  userId,
  items,
  total,
  paymentMethod,
}: CreateOrderDTO) => {
  if (!items || items.length === 0) {
    throw new Error("No order items");
  }

  const order = await Order.create({
    user: userId,
    items,
    total,
    paymentMethod,
  });

  // Clear cart after successful order
  await Cart.updateOne(
    { userId },
    { $set: { items: [] } }
  );

  return order;
};

/* =========================
   LIST ORDERS
========================= */
export const listOrders = async (
  userId: Types.ObjectId,
  isAdmin: boolean,
) => {
  if (isAdmin) {
    return Order.find().populate("user").lean();
  }

  return Order.find({ user: userId })
    .populate("items.product")
    .lean();
};
