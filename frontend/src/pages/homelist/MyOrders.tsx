import { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-8">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 relative">
      {/* Logo Top Left */}
      <div className="absolute top-6 left-8">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide hover:opacity-80 transition"
        >
          Dark<span className="text-yellow-400">.</span>Cart
        </Link>
      </div>

      {/* Page Content */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-400">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-black border border-gray-800 p-5 rounded-lg"
              >
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Order ID: {order._id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-3">
                  <p className="font-semibold">Total: ₹{order.total}</p>
                  <p className="text-gray-400">
                    Payment: {order.paymentMethod}
                  </p>

                  {/* Products in this order */}
                  <div className="mt-3 border-t border-gray-800 pt-3">
                    <p className="text-gray-400 text-sm mb-1">Products:</p>

                    {order.items
                      ?.filter((item: any) => item.product)
                      .map((item: any) => (
                        <p
                          key={item.product._id}
                          className="text-sm text-gray-300"
                        >
                          • {item.product.title} × {item.qty}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
