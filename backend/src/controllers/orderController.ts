import { Request, Response } from "express";
import * as orderService from "../services/orderService.js";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!._id;
    const { items, total, paymentMethod } = req.body;

    const order = await orderService.createOrder({
      userId,
      items,
      total,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/* =========================
   LIST ORDERS
========================= */
export const listOrders = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user!._id;
    const isAdmin = req.user!.roles?.includes("ADMIN") ?? false;

    const orders = await orderService.listOrders(
      userId,
      isAdmin,
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};
