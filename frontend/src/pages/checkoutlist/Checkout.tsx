import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import CheckoutForm from "../../components/CheckoutForm";
import OrderSummary from "../../components/OrderSummary";
import { fetchCart } from "../../store/slice/cartSlice";
import type { RootState, AppDispatch } from "../../store/store";
import API from "../../api/api";

export default function Checkout() {
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector(
    (state: RootState) => state.cart.items
  );

  /* ---------------- FETCH CART ---------------- */

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* ---------------- CALCULATE TOTAL ---------------- */

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- RAZORPAY PAYMENT ---------------- */

  const handlePayment = async () => {
    try {
      const { data } = await API.post("/payment/create-order", {
        amount: totalPrice,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Dark Cart",
        description: "Order Payment",
        order_id: data.id,

        handler: function (response: any) {
          console.log("Payment Success", response);
          alert("Payment Successful!");
        },

        theme: {
          color: "#FACC15",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="p-6 bg-[#020617] min-h-screen text-gray-200">
        <h1 className="text-xl font-bold mb-6">
          Checkout — Shipping & Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <CheckoutForm items={cartItems} />

          <div>
            <OrderSummary items={cartItems} />

            {/* PAY BUTTON */}
            <button
              onClick={handlePayment}
              className="mt-4 w-full bg-yellow-500 text-black font-semibold py-2 rounded"
            >
              Pay ₹{totalPrice}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}