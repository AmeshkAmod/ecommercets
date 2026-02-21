import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slice/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const product = item.productId;

  if (!product) return null;

  const handleDecrease = () => {
    if (item.quantity === 1) {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(
        updateCartItem({
          productId: product._id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleIncrease = () => {
    dispatch(
      updateCartItem({
        productId: product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  return (
    <div className="grid grid-cols-[100px_1fr] gap-4 bg-[#020617] border border-gray-800 rounded-xl p-4">

      {/* Image */}
      <div className="flex items-center justify-center border border-gray-800 rounded-lg p-2">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-20 object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{product.title}</h3>
        <p className="text-yellow-400 font-bold">₹{product.price}</p>

        <div className="flex justify-between items-center mt-2 gap-2">

          {/* Quantity Control */}
          <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 hover:bg-red-500/10"
            >
              {item.quantity === 1 ? "🗑" : "−"}
            </button>

            <span className="px-3 text-sm border-x border-gray-700">
              {item.quantity}
            </span>

            <button
              onClick={handleIncrease}
              className="px-3 py-1 hover:bg-green-500/10"
            >
              +
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => dispatch(removeFromCart(product._id))}
            className="text-xs text-red-400 border border-red-400 px-3 py-1 rounded-full hover:bg-red-500/10"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
