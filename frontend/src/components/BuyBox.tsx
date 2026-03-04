import { useDispatch } from "react-redux";
import { useState, type MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "../store/slice/cartSlice";
import type { Product } from "../types/product";
import type { AppDispatch } from "../store/store";

interface BuyBoxProps {
  product: Product;
}

export default function BuyBox({ product }: BuyBoxProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [added, setAdded] = useState<boolean>(false);

  const handleAddToCart = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    const res = await dispatch(addToCart(product._id));

    if (res.meta.requestStatus === "fulfilled") {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <aside className="bg-[#020617] border border-gray-800 rounded-xl p-5">
      <div className="text-lg font-bold text-yellow-400 mb-1">
        Rs {product.price}
      </div>

      <p className="text-xs text-gray-400 mb-3">
        Free delivery - Cash on Delivery available
      </p>

      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400 }}
        className={`w-full py-2 rounded-full font-semibold text-sm transition flex items-center justify-center gap-2 ${
          added
            ? "bg-green-500 text-black"
            : "bg-yellow-400 text-black hover:brightness-110"
        }`}
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              ✓ Added to Cart
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              🛒 Add to Cart
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="text-xs text-gray-500 mt-3">
        Secure checkout - Trusted sellers
      </div>
    </aside>
  );
}