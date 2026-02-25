import type { CartItem } from "../types/cart";

interface OrderSummaryProps {
  items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  const totalQty = items.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, i) =>
      sum + i.productId.price * i.quantity,
    0
  );

  return (
    <aside className="bg-[#020617] border border-gray-800 rounded-xl p-5 h-fit">
      <h3 className="font-semibold mb-4">Order Summary</h3>

      {items.map((i) => (
        <div
          key={i.productId._id}
          className="flex justify-between text-sm mb-2"
        >
          <div className="max-w-[70%]">
            <div className="font-semibold">
              {i.productId.title}
            </div>
            <div className="text-gray-400">
              {i.quantity} × ₹{i.productId.price}
            </div>
          </div>
          <div className="font-bold">
            ₹{i.productId.price * i.quantity}
          </div>
        </div>
      ))}

      <hr className="my-3 border-gray-800" />

      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Items</span>
        <span>{totalQty}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>Delivery</span>
        <span className="text-green-400">Free</span>
      </div>

      <div className="flex justify-between text-lg font-bold mt-2">
        <span>Total</span>
        <span className="text-yellow-400">
          ₹{subtotal}
        </span>
      </div>
    </aside>
  );
}