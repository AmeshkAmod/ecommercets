import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../store/slice/authSlice";
import { fetchCart } from "../store/slice/cartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((s) => s.auth);
  const cartItems = useSelector((s) => s.cart.items);

  const [search, setSearch] = useState("");

  // 🔥 fetch cart on load / refresh
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  // 🔢 cart quantity
  const totalQty = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // 🔍 SEARCH HANDLER
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#020617] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wide text-gray-100"
        >
          Dark<span className="text-yellow-400">.</span>Cart
        </Link>

        {/* 🔍 Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
          />

          {/* Search icon */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition"
          >
            🔍
          </button>
        </form>

        {/* Right Actions */}
        <nav className="flex items-center gap-5 text-sm text-gray-300">

          {isAuthenticated && (
            <Link
              to="/checkout"
              className="hover:text-yellow-400 transition"
            >
              Quick Checkout
            </Link>
          )}

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="border border-yellow-400 text-yellow-400 px-4 py-1.5 rounded-full hover:bg-yellow-400 hover:text-black transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
              className="border border-red-400 text-red-400 px-4 py-1.5 rounded-full hover:bg-red-400 hover:text-black transition"
            >
              Logout
            </button>
          )}

          {/* 🛒 CART WITH COUNT */}
          <Link
            to="/cart"
            className="relative border border-gray-700 px-4 py-1.5 rounded-full hover:border-yellow-400 transition"
          >
            🛒 Cart

            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
                {totalQty}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
