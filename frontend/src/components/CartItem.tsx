import { useRef } from "react";
import { useDispatch } from "react-redux";
import type { CartItem } from "../types/cart";
import type { AppDispatch } from "../store/store";
import {
  removeFromCart,
  updateCartItem,
} from "../store/slice/cartSlice";

interface CartItemProps {
  item: CartItem;
  onRemove?: (productId: string, sourceElement: HTMLElement) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const cardRef = useRef<HTMLDivElement>(null);
  const product = item.productId;

  if (!product) return null;

  const handleRemove = () => {
    const sourceElement = cardRef.current;
    if (onRemove && sourceElement) {
      onRemove(product._id, sourceElement);
      return;
    }

    dispatch(removeFromCart(product._id));
  };

  const handleDecrease = () => {
    if (item.quantity === 1) {
      handleRemove();
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
    <div
      ref={cardRef}
      className="grid grid-cols-[100px_1fr] gap-4 bg-[#020617] border border-gray-800 rounded-xl p-4"
    >
      <div className="flex items-center justify-center border border-gray-800 rounded-lg p-2">
        <img
          src={
            Array.isArray(product.images)
            ? product.images[0]
            : (product as any). images
          }
          alt={product.title}
          className="max-h-20 object-contain"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{product.title}</h3>
        <p className="text-yellow-400 font-bold">₹{product.price}</p>

        <div className="flex justify-between items-center mt-2 gap-2">
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

          <button
            onClick={handleRemove}
            className="text-xs text-red-400 border border-red-400 px-3 py-1 rounded-full hover:bg-red-500/10"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
