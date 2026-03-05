import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "../types/product";

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selected, setSelected] = useState(0)

  const images = product.images || [];
  const [index, setIndex] = useState(0)


  if (images.length === 0) {
    return (
      <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
        No image
      </div>
    )
  }

  const next = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setIndex((prev) => (prev -1 + images.length) % images.length);
  }


  return (
    <div className="flex gap-4">

      {/* Thumbnails */}
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
             onClick={() => setIndex(i)}
            className={`w-16 h-16 object-cover cursor-pointer border rounded ${selected ===i ? "border-yellow-400" : "border-gray-700"}`}
          />
        ))}
      </div>

      {/* Main image */} 
      <div className=" relative bg-[#020617] border border-gray-800 rounded-xl p-6 flex items-center justify-center w-full">
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={product.title}
          className="max-h-96 object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        />

        {/* Left arrow */}
        {images.length > 1 && (
          <button
            onClick={prev}

          >
            ‹
          </button>
        )}

        {/* Right arrow */}
        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute right-2 bg-black/60 px-3 py-1 rounded text-white"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}