import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToCart } from "../store/slice/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState, type MouseEvent } from "react";
import { motion } from "framer-motion";

import type { Product } from "../types/product";
import type { RootState } from "../store/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useAppSelector((state: RootState) => state.auth);
  const isAuthenticated = !!token;

  const cartStatus = useAppSelector((state: RootState) => state.cart.status);

  const [added, setAdded] = useState<boolean>(false);

  if (!product) return null;

  const stock = product.countInStock ?? 0;
  const inStock = stock > 0;

  const handleAddToCart = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!inStock) return;

    const res = await dispatch(addToCart(product._id));

    if (res.meta.requestStatus === "fulfilled") {
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-black border border-gray-800 rounded-xl p-4 text-gray-200 flex flex-col hover:border-yellow-400 transition"
    >
      <Link to={`/product/${product._id}`}>
        <motion.img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain mb-3"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 200 }}
        />
      </Link>

      <h3 className="text-sm font-semibold line-clamp-2">{product.title}</h3>

      <p className="text-yellow-400 font-bold mt-1">₹{product.price}</p>

      <p
        className={`text-xs mt-1 ${
          inStock ? "text-green-400" : "text-red-400"
        }`}
      >
        {inStock ? `${stock} left in stock` : "Out of stock"}
      </p>

      <div className="mt-auto flex gap-2 pt-3">

        {/* VIEW DETAILS */}
        <Link
          to={`/product/${product._id}`}
          className="flex-1 text-center border border-gray-700 text-gray-300 py-2 rounded-full text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
        >
          View Details
        </Link>

        {/* ADD TO CART BUTTON */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!inStock || cartStatus === "loading"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`flex-1 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-1
          ${
            added
              ? "bg-green-500 text-black"
              : "bg-yellow-400 text-black hover:brightness-110"
          }
          disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1"
            >
              ✔ Added
            </motion.span>
          ) : cartStatus === "loading" ? (
            "Adding..."
          ) : (
            <span className="flex items-center gap-1">
              🛒 Add
            </span>
          )}
        </motion.button>

      </div>
    </motion.div>
  );
}