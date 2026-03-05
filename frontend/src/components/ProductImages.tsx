import type { Product } from "../types/product";

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {

  let imageUrl = "";

  if (product.images && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (Array.isArray(product.image)) {
    imageUrl = product.image[0]
  } else {
    imageUrl = product.images;
  }


  return (
    <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 flex items-center justify-center">
      <img
        src={imageUrl}
        alt={product.title}
        className="max-h-80 object-contain"
      />
    </div>
  );
}