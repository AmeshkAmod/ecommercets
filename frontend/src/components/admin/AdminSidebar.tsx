import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-gray-800 p-6">
      <h1 className="text-xl font-extrabold text-yellow-400 mb-8">
        Admin Panel
      </h1>

      <nav className="flex flex-col gap-4 text-sm">
        <Link to="/admin" className="hover:text-yellow-400">
          Dashboard
        </Link>
        <Link to="/admin/orders" className="hover:text-yellow-400">
          Orders
        </Link>
        <Link to="/admin/products" className="hover:text-yellow-400">
          Products
        </Link>
        <Link to="/" className="hover:text-yellow-400">
          Home
        </Link>
      </nav>
    </aside>
  );
}
