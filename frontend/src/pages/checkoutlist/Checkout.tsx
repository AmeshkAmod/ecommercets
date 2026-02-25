import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import CheckoutForm from "../../components/CheckoutForm";
import OrderSummary from "../../components/OrderSummary";
import { fetchCart } from "../../store/slice/cartSlice";
import type { RootState, AppDispatch } from "../../store/store";

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <main className="p-6 bg-[#020617] min-h-screen text-gray-200">
        <h1 className="text-xl font-bold mb-6">
          Checkout — Shipping & Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <CheckoutForm items={cartItems} />
          <OrderSummary items={cartItems} />
        </div>
      </main>
    </>
  );
}