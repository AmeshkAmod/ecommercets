import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import CartItem from "../../components/CartItem";
import CartSummary from "../../components/CartSummary";
import { fetchCart } from "../../store/slice/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <main className="p-6 bg-[#020617] min-h-screen grid grid-cols-1 lg:grid-cols-[2.3fr_1.1fr] gap-6 text-gray-200">
        {/* Cart Items */}
        <section className="bg-[#020617] border border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold mb-4">Your Shopping Cart</h2>

          {items.length === 0 && (
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          )}

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <CartItem key={item.productId._id} item={item} />
            ))}
          </div>
        </section>

        <CartSummary items={items} />
      </main>
    </>
  );
}
