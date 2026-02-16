import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slice/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const cartStatus = useSelector((s) => s.cart.status);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const stock =
    product.countInStock ??
    product.stock ??
    product.quantity ??
    0;

  const inStock = stock > 0;

  const handleAddToCart = async (e) => {
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
    <div className="bg-black border border-gray-800 rounded-xl p-4 text-gray-200 flex flex-col hover:border-yellow-400 transition">

      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.title}
          className="h-40 w-full object-contain mb-3 hover:scale-105 transition-transform"
        />
      </Link>

      <h3 className="text-sm font-semibold line-clamp-2">
        {product.title}
      </h3>

      <p className="text-yellow-400 font-bold mt-1">
        ₹{product.price}
      </p>

      <p className={`text-xs mt-1 ${inStock ? "text-green-400" : "text-red-400"}`}>
        {inStock ? `${stock} left in stock` : "Out of stock"}
      </p>

      <div className="mt-auto flex gap-2 pt-3">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 text-center border border-gray-700 text-gray-300 py-2 rounded-full text-xs hover:border-yellow-400 hover:text-yellow-400 transition"
        >
          View Details
        </Link>

        <button
          onClick={handleAddToCart}
          disabled={!inStock || cartStatus === "loading"}
          className={`flex-1 py-2 rounded-full text-xs font-semibold transition
            ${added ? "bg-green-500 text-black" : "bg-yellow-400 text-black hover:brightness-110"}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {added ? "✔ Added" : cartStatus === "loading" ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
