import { Types } from "mongoose";
import ProductModel from "../models/Product.js";
import Cart from "../models/Cart.js";
import OrderModel from "../models/Order.js";
import UserModel from "../models/User.js";

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

  const order = await OrderModel.create({
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
    return OrderModel.find()
      .populate("user","name email address phone")
      .populate("items.product", "title price image")
      .sort({ createdAt: -1 })
      .lean();
  }

  return OrderModel.find({ user: userId })
    .populate("items.product", "title price image")
    .lean();
};

export const getAdminStats = async () => {
  
  const totalOrders = await OrderModel.countDocuments();

  const revenueData = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  const totalProducts = await ProductModel.countDocuments();

  return {
    totalOrders,
    totalRevenue,
    totalProducts,
  };
};