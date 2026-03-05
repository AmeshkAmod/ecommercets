import { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import CartItem from "../../components/CartItem";
import CartSummary from "../../components/CartSummary";
import { useAppDispatch } from "../../store/hooks";
import { fetchCart } from "../../store/slice/cartSlice";
import type { RootState } from "../../store/store";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, status } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
                <CartItem key={item.productId._id} item={item} />
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
