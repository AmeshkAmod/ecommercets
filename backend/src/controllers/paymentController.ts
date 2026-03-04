import { Request, Response } from "express";
import { createOrder } from "../services/paymentService.js";

export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const order = await createOrder(amount);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Payment creation failed" });
  }
};