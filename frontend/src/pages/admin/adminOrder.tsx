import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "./AdminLayout";
import { fetchAllOrders } from "../../store/slice/adminOrderSlice";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(s => s.adminOrders.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Orders</h1>

      <table className="w-full text-sm border border-gray-800">
        <thead className="bg-black">
          <tr>
            <th className="p-3">ID</th>
            <th>User</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id} className="border-t border-gray-800">
              <td className="p-3">{o._id.slice(-6)}</td>
              <td>{o.user?.email}</td>
              <td>₹{o.total}</td>
              <td>{o.status}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
