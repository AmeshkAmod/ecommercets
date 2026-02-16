import type { Request, Response } from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

interface OrderItemInput {
  product: string;
  qty: number;
  price: number;
}

interface CreateOrderBody {
  items: OrderItemInput[];
  total: number;
  paymentMethod: string;
}

// CREATE ORDER
export const createOrder = async (
  req: Request<Record<string, never>, unknown, CreateOrderBody>,
  res: Response,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const { items, total, paymentMethod } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    paymentMethod,
  });

  await Cart.findOneAndUpdate({ userId: req.user._id }, { $set: { items: [] } });
  return res.status(201).json(order);
};

// LIST ORDERS
export const listOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.isAdmin) {
      const orders = await Order.find().populate("user");
      return res.json(orders);
    }

    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    return res.json(orders);
  } catch (_err: unknown) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};
