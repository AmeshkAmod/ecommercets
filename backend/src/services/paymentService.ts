import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (amount: number) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay uses paise
    currency: "INR",
    receipt: "order_receipt",
  });

  return order;
};