export default function ProductImages({ product }) {
  return (
    <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 flex items-center justify-center">
      <img
        src={product.image}
        alt={product.title}
        className="max-h-[320px] object-contain"
      />
    </div>
  );
}
