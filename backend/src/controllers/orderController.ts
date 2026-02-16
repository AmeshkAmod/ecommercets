import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  const { items, total, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    total,
    paymentMethod,
  });

  // ✅ clear cart after order
  await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { items: [] } }
  );

  res.status(201).json(order);
};

// LIST ORDERS (THIS WAS MISSING)
export const listOrders = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const orders = await Order.find().populate("user");
      return res.json(orders);
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("items.product");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
