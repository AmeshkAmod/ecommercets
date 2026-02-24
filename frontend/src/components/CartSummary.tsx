import { useNavigate } from "react-router-dom";
import type { CartItem } from "../types/cart";

interface CartSummaryProps {
  items: CartItem[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const navigate = useNavigate();

  const totalQty = items.reduce(
    (sum: number, i: CartItem) => sum + i.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum: number, i: CartItem) =>
      sum + i.productId.price * i.quantity,
    0
  );

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate("/checkout");
  };

  return (
    <aside className="bg-[#020617] border border-gray-800 rounded-xl p-5 sticky top-20 text-gray-200">
      <h3 className="font-semibold mb-4">Order Summary</h3>

      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Items</span>
        <span>{totalQty}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Delivery</span>
        <span className="text-green-400">Free</span>
      </div>

      <div className="flex justify-between text-lg font-bold mt-3">
        <span>Total</span>
        <span className="text-yellow-400">₹{subtotal}</span>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full mt-4 bg-yellow-400 text-black py-2 rounded-full font-semibold text-sm
                   hover:bg-yellow-500 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
      </button>
    </aside>
  );
}