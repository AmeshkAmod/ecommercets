import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice/cartSlice";
import type { Product } from "../types/product";
import type { AppDispatch } from "../store/store";

interface BuyBoxProps {
  product: Product;
}

export default function BuyBox({ product }: BuyBoxProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <aside className="bg-[#020617] border border-gray-800 rounded-xl p-5">
      <div className="text-lg font-bold text-yellow-400 mb-1">
        ₹{product.price}
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Free delivery · Cash on Delivery available
      </p>

      <button
        onClick={() => dispatch(addToCart(product._id))}
        className="w-full bg-yellow-400 text-black py-2 rounded-full font-semibold text-sm"
      >
        🛒 Add to Cart
      </button>

      <div className="text-xs text-gray-500 mt-3">
        Secure checkout · Trusted sellers
      </div>
    </aside>
  );
}