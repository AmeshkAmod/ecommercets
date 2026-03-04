import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState, type FormEvent } from "react";
import { logout } from "../store/slice/authSlice";
import { fetchCart } from "../store/slice/cartSlice";
import type { RootState } from "../store/store";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  const isAuthenticated = !!user;

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/?q=${encodeURIComponent(search)}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const isAdmin = user?.role?.some((r) => r.name === "ADMIN") ?? false;

  /* SEARCH SUGGESTIONS */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/products?q=${search}`
        );

        const data = await res.json();

        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <header className="sticky top-0 z-50 bg-[#020617] border-b border-gray-800">

      {/* NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-gray-200 text-xl"
        >
          ☰
        </button>

        {/* LOGO */}
        <Link
          to="/"
          className="text-lg sm:text-xl font-extrabold text-gray-100"
        >
          Dark<span className="text-yellow-400">.</span>Cart
        </Link>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />

          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
          >
            🔍
          </button>

          {/* SEARCH DROPDOWN */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[#020617] border border-gray-700 rounded-lg shadow-xl max-h-72 overflow-y-auto z-50">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    setShowSuggestions(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-200">
                      {product.title}
                    </span>

                    <span className="text-xs text-yellow-400">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-5 text-gray-300">

          {isAuthenticated && (
            <Link to="/checkout" className="hover:text-yellow-400">
              Quick Checkout
            </Link>
          )}

          {/* CART */}
          <Link
            to="/cart"
            className="relative border border-gray-700 px-3 py-1 rounded-full hover:border-yellow-400"
          >
            🛒

            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {/* PROFILE */}
          {isAuthenticated && (
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-gray-800 rounded-xl shadow-xl overflow-hidden">

                  <div className="p-4 border-b border-gray-800">
                    <p className="font-semibold">{user?.name}</p>
                  </div>

                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-800">
                    My Profile
                  </Link>

                  <Link to="/my-orders" className="block px-4 py-2 hover:bg-gray-800">
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/40"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          )}

        </nav>

        {/* MOBILE CART */}
        <Link
          to="/cart"
          className="lg:hidden relative border border-gray-700 px-3 py-1 rounded-full"
        >
          🛒

          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </Link>

      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="lg:hidden px-6 pb-4 space-y-3 border-t border-gray-800">

          {isAuthenticated && (
            <div className="pb-2 border-b border-gray-800 text-gray-200">
              Logged in as <span className="font-semibold">{user?.name}</span>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="block text-indigo-400"
            >
              Admin Panel
            </button>
          )}

          {isAuthenticated && (
            <Link to="/checkout" className="block text-gray-300">
              Quick Checkout
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/login" className="block text-yellow-400">
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="block text-gray-300">
                My Profile
              </Link>

              <Link to="/my-orders" className="block text-gray-300">
                My Orders
              </Link>

              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="text-red-400"
              >
                Logout
              </button>
            </>
          )}

        </div>
      )}
    </header>
  );
}