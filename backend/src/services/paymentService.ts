import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = async (amount: number) => {
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: "order_receipt",
  });

  return order;
};