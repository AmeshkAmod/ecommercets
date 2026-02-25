import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../api/api";
import { clearCart } from "../store/slice/cartSlice";
import type { CartItem } from "../types/cart";
import type { AppDispatch } from "../store/store";
import axios from "axios";

interface CheckoutFormProps {
  items: CartItem[];
}

interface ShippingAddress {
  name: string;
  phone: string;
  line: string;
  city: string;
  postal: string;
  country: string;
}

export default function CheckoutForm({ items }: CheckoutFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    line: "",
    city: "",
    postal: "",
    country: "India",
  });

  const [payment, setPayment] = useState<string>("COD");
  const [status, setStatus] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const placeOrder = async (): Promise<void> => {
    setStatus("");

    if (!address.name || !address.line || !address.city || !address.postal) {
      setStatus("Please fill all required address fields.");
      return;
    }

    if (!items || items.length === 0) {
      setStatus("Your cart is empty.");
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product: item.productId._id,
        qty: item.quantity,
        price: item.productId.price,
      }));

      const total = items.reduce(
        (sum, item) => sum + item.productId.price * item.quantity,
        0
      );

      await API.post("/orders", {
        items: orderItems,
        total,
        paymentMethod: payment,
      });

      setSuccess(true);
      setStatus("✅ Order placed successfully!");
      dispatch(clearCart());

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatus(err.response?.data?.message || "Order failed");
      } else {
        setStatus("Something went wrong");
      }
    }
  };

  return (
    <section className="bg-[#020617] border border-gray-800 rounded-xl p-5">
      <h2 className="font-semibold mb-4">Shipping Address</h2>

      {(
        [
          { label: "Full Name", name: "name" },
          { label: "Phone", name: "phone" },
          { label: "Address Line", name: "line" },
          { label: "City", name: "city" },
          { label: "Postal Code", name: "postal" },
          { label: "Country", name: "country" },
        ] as { label: string; name: keyof ShippingAddress }[]
      ).map((f) => (
        <div key={f.name} className="mb-3">
          <label className="block text-xs text-gray-400 mb-1">
            {f.label}
          </label>
          <input
            type="text"
            name={f.name}
            value={address[f.name]}
            onChange={handleChange}
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2 text-sm"
          />
        </div>
      ))}

      <h2 className="font-semibold mt-5 mb-2">Payment Method</h2>

      <div className="flex flex-col gap-2 text-sm">
        {["COD", "Card", "PayPal"].map((p) => (
          <label key={p} className="flex items-center gap-2">
            <input
              type="radio"
              checked={payment === p}
              onChange={() => setPayment(p)}
            />
            {p === "COD" ? "Cash on Delivery" : `${p} (mock)`}
          </label>
        ))}
      </div>

      <button
        onClick={placeOrder}
        disabled={success}
        className="mt-5 w-full bg-yellow-400 text-black py-2 rounded-full font-semibold text-sm
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {success ? "Order Placed" : "Place Order"}
      </button>

      {status && (
        <p className="text-xs mt-3 text-gray-400">
          {status}
        </p>
      )}
    </section>
  );
}