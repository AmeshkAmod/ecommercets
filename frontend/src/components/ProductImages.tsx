import { useState } from "react";
import type { Product } from "../types/product";

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selected, setSelected] = useState(0)

  const images = product.images || [];

  if (images.length === 0) {
    return (
      <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
        No image
      </div>
    )
  }


  return (
    <div className="flex gap-4">

      {/* Thumbnails */}
      <div>
        {images.map((img, i) => (
          <img
            key={i}
             onClick={() => setSelected(i)}
            className={`w-16 h-16 object-cover cursor-pointer border rounded ${selected ===i ? "border-yellow-400" : "border-gray-700"}`}
          />
        ))}
      </div>

      {/* Main image */} 
      <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 flex items-center justify-center">
        <img
          src={images[selected]}
          alt={product.title}
          className="max-h-96 object-contain"
        />
      </div>
    </div>
  );
}