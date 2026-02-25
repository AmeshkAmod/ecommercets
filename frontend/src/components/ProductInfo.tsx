import type { Product } from "../types/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="bg-[#020617] border border-gray-800 rounded-xl p-5">
      <span className="inline-block text-xs px-3 py-1 rounded-full border border-gray-600 text-gray-300 mb-3">
        {product.category || "Category"}
      </span>

      <h1 className="text-xl font-bold">{product.title}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm mt-2">
        <span className="text-yellow-400">
          {"★".repeat(Math.round(product.rating ?? 4))}
        </span>
        <span className="text-gray-400">
          ({product.numReviews ?? 0} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="text-2xl font-extrabold text-yellow-400 mt-3">
        ₹{product.price}
      </div>

      {/* Stock */}
      <div
        className={`text-sm mt-1 ${
          product.countInStock > 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        {product.countInStock > 0 ? "In stock" : "Out of stock"}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mt-4 leading-relaxed">
        {product.description}
      </p>
    </div>
  );
}