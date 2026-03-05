import { motion } from "framer-motion";
import type { Product } from "../types/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="bg-[#020617] border border-gray-800 rounded-xl p-5"
    >
      <motion.span
        whileHover={{ scale: 1.05 }}
        className="inline-block text-xs px-3 py-1 rounded-full border border-gray-600 text-gray-300 mb-3"
      >
        {product.category || "Category"}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-bold"
      >
        {product.title}
      </motion.h1>

      {/* Rating */}
      <motion.div
        className="flex items-center gap-2 text-sm mt-2"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-yellow-400">
          {"★".repeat(Math.round(product.rating ?? 4))}
        </span>
        <span className="text-gray-400">
          ({product.numReviews ?? 0} reviews)
        </span>
      </motion.div>

      {/* Price */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="text-2xl font-extrabold text-yellow-400 mt-3"
      >
        ₹{product.price}
      </motion.div>

      {/* Stock */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-sm mt-1 ${
          product.countInStock > 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {product.countInStock > 0 ? "In stock" : "Out of stock"}
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-400 text-sm mt-4 leading-relaxed"
      >
        {product.description}
      </motion.p>
    </motion.div>
  );
}