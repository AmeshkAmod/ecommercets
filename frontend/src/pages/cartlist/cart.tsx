import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import CartItem from "../../components/CartItem";
import CartSummary from "../../components/CartSummary";
import { useAppDispatch } from "../../store/hooks";
import { fetchCart, removeFromCart } from "../../store/slice/cartSlice";
import type { RootState } from "../../store/store";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, status } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const animateItemToBasket = useCallback((sourceElement: HTMLElement) => {
    const basket = document.getElementById("cart-waste-basket");
    if (!basket) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    const clone = sourceElement.cloneNode(true) as HTMLElement;

    clone.style.position = "fixed";
    clone.style.top = `${sourceRect.top}px`;
    clone.style.left = `${sourceRect.left}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.margin = "0";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "70";
    clone.style.overflow = "hidden";
    clone.style.opacity = "0.95";
    clone.style.transform = "translate(0, 0) scale(1) rotate(0deg)";
    clone.style.transformOrigin = "center";
    clone.style.transition =
      "transform 620ms cubic-bezier(0.25, 0.8, 0.2, 1), opacity 620ms ease, filter 620ms ease";

    document.body.appendChild(clone);

    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const basketCenterX = basketRect.left + basketRect.width / 2;
    const basketCenterY = basketRect.top + basketRect.height / 2;
    const translateX = basketCenterX - sourceCenterX;
    const translateY = basketCenterY - sourceCenterY;

    requestAnimationFrame(() => {
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.15) rotate(-18deg)`;
      clone.style.opacity = "0.1";
      clone.style.filter = "blur(2px)";
    });

    basket.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(1.14)", filter: "brightness(1.4)" },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      { duration: 420, easing: "ease-out" }
    );

    window.setTimeout(() => {
      clone.remove();
    }, 700);
  }, []);

  const handleRemoveWithAnimation = useCallback(
    (productId: string, sourceElement: HTMLElement) => {
      animateItemToBasket(sourceElement);
      window.setTimeout(() => {
        dispatch(removeFromCart(productId));
      }, 120);
    },
    [animateItemToBasket, dispatch]
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#020617] text-gray-200 p-6">
        <h1 className="text-xl font-bold mb-6">Your Cart</h1>

        {status === "loading" && items.length === 0 && (
          <p className="text-gray-400 text-sm">Loading cart...</p>
        )}

        {status !== "loading" && items.length === 0 && (
          <p className="text-gray-400 text-sm">Nothing here.</p>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <section className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.productId._id}
                  item={item}
                  onRemove={handleRemoveWithAnimation}
                />
              ))}
            </section>

            <CartSummary items={items} />
          </div>
        )}

        <div
          id="cart-waste-basket"
          className="fixed right-6 bottom-6 z-40 h-14 w-14 rounded-full border border-red-500/50 bg-red-500/10 text-red-400 shadow-lg shadow-red-900/30 flex items-center justify-center"
          aria-label="Waste basket"
          title="Waste basket"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M6 6l1 14h10l1-14" />
            <path d="M10 10v7" />
            <path d="M14 10v7" />
          </svg>
        </div>
      </main>
    </>
  );
}
