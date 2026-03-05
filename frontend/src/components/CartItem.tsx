import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import type { CartItem } from "../types/cart";
import type { AppDispatch } from "../store/store";
import {
  removeFromCart,
  updateCartItem,
} from "../store/slice/cartSlice";

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const cardRef = useRef<HTMLDivElement>(null);
  const [removing, setRemoving] = useState(false);
  const [flyTo, setFlyTo] = useState({ x: 280, y: 320 });
  const [flyOrigin, setFlyOrigin] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const product = item.productId;
  if (!product) return null;

  const productImage =
    product.images?.[0] ||
    (product as CartItem["productId"] & { image?: string }).image ||
    "";

  const handleDecrease = () => {
    if (item.quantity === 1) {
      handleRemove();
      return;
    }

    dispatch(
      updateCartItem({
        productId: product._id,
        quantity: item.quantity - 1,
      })
    );
  };

  const handleIncrease = () => {
    dispatch(
      updateCartItem({
        productId: product._id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleRemove = () => {
    if (removing) return;

    const cardRect = cardRef.current?.getBoundingClientRect();
    const basketEl = document.getElementById("cart-waste-basket");
    const basketRect = basketEl?.getBoundingClientRect();

    if (cardRect) {
      const fromX = cardRect.left + cardRect.width / 2;
      const fromY = cardRect.top + cardRect.height / 2;
      const toX = basketRect
        ? basketRect.left + basketRect.width / 2
        : window.innerWidth - 56;
      const toY = basketRect
        ? basketRect.top + basketRect.height / 2
        : window.innerHeight - 56;

      setFlyOrigin({
        left: cardRect.left,
        top: cardRect.top,
        width: cardRect.width,
      });

      setFlyTo({
        x: Math.max(24, toX - fromX),
        y: Math.max(24, toY - fromY),
      });
    }

    setRemoving(true);
    setTimeout(() => {
      dispatch(removeFromCart(product._id));
    }, 680);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={
        removing
          ? {
              x: [0, flyTo.x * 0.62, flyTo.x],
              y: [0, flyTo.y * 0.18, flyTo.y],
              scale: [1, 0.7, 0.1],
              rotate: [0, 10, 24],
              opacity: [1, 1, 0],
            }
          : { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }
      }
      transition={{ duration: removing ? 0.65 : 0.3, ease: "easeInOut" }}
      className={`grid grid-cols-[100px_1fr] gap-4 bg-[#020617] border border-gray-800 rounded-xl p-4 ${
        removing ? "pointer-events-none" : ""
      }`}
      style={
        removing && flyOrigin
          ? {
              position: "fixed",
              left: flyOrigin.left,
              top: flyOrigin.top,
              width: flyOrigin.width,
              zIndex: 60,
            }
          : undefined
      }
    >
      <div className="flex items-center justify-center border border-gray-800 rounded-lg p-2">
        <img
          src={productImage}
          alt={product.title}
          className="max-h-20 object-contain"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/160x160/020617/e5e7eb?text=No+Image";
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">{product.title}</h3>
        <p className="text-yellow-400 font-bold">Rs {product.price}</p>

        <div className="flex justify-between items-center mt-2 gap-2">
          <div className="flex items-center border border-gray-700 rounded-full overflow-hidden">
            <button
              onClick={handleDecrease}
              className="px-3 py-1 hover:bg-red-500/10"
            >
              {item.quantity === 1 ? "Del" : "-"}
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
    </motion.div>
  );
}
