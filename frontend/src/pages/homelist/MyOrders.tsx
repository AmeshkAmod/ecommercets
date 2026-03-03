import { useEffect, useState } from "react";
import API from "../../api/api";
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
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-5xl mx-auto">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
