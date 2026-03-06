import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { logout } from "../store/slice/authSlice";
import { fetchCart } from "../store/slice/cartSlice";
import type { RootState } from "../store/store";

export default function Navbar() {
  const MotionLink = motion(Link);
  const tapHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.15 },
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state: RootState) => state.auth);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  const isAuthenticated = !!user;

  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;

    navigate(`/?q=${encodeURIComponent(search)}`);
    setSearch("");
    setShowSuggestions(false);
  };

  const isAdmin = user?.role?.some((r) => r.name === "ADMIN") ?? false;

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
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <motion.button
          {...tapHover}
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden text-gray-200 text-xl"
        >
          ?
        </motion.button>

        {isAdmin && (
          <motion.button
            {...tapHover}
            onClick={() => navigate("/admin")}
            className="hidden lg:block text-indigo-400 font-semibold hover:text-indigo-300"
          >
            Admin Panel
          </motion.button>
        )}

        <MotionLink
          {...tapHover}
          to="/"
          className="text-lg sm:text-xl font-extrabold text-gray-100"
        >
          Dark<span className="text-yellow-400">.</span>Cart
        </MotionLink>

        <form onSubmit={handleSearch} className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-black border border-gray-700 rounded-full px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-yellow-400"
          />

          <motion.button
            {...tapHover}
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
          >
            ??
          </motion.button>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-[#020617] border border-gray-700 rounded-lg shadow-xl max-h-72 overflow-y-auto z-50">
              {suggestions.map((product) => (
                <motion.div
                  key={product._id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                    setShowSuggestions(false);
                    setSearch("");
                  }}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800"
                >
                  <img
                    src={
                      Array.isArray(product.images)
                        ? product.images[0]
                        : (product as any).images
                    }
                    alt={product.title}
                    className="w-10 h-10 object-cover rounded"
                  />

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-200">{product.title}</span>

                    <span className="text-xs text-yellow-400">
                      ?{product.price}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </form>

        <nav className="hidden lg:flex items-center gap-5 text-gray-300">
          {isAuthenticated && (
            <MotionLink {...tapHover} to="/checkout" className="hover:text-yellow-400">
              Quick Checkout
            </MotionLink>
          )}

          <MotionLink
            {...tapHover}
            to="/cart"
            className="relative border border-gray-700 px-3 py-1 rounded-full hover:border-yellow-400"
          >
            🛒

            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </MotionLink>

          {!isAuthenticated && (
            <MotionLink
              {...tapHover}
              to="/login"
              className="px-4 py-1 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            >
              Login
            </MotionLink>
          )}

          {isAuthenticated && (
            <div className="relative" ref={profileRef}>
              <motion.button
                {...tapHover}
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-yellow-400 text-black font-bold flex items-center justify-center"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </motion.button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-gray-800 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-800">
                    <p className="font-semibold">{user?.name}</p>
                  </div>

                  {isAdmin && (
                    <motion.button
                      {...tapHover}
                      onClick={() => navigate("/admin")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-indigo-400"
                    >
                      Admin Panel
                    </motion.button>
                  )}

                  <MotionLink
                    {...tapHover}
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    My Profile
                  </MotionLink>

                  <MotionLink
                    {...tapHover}
                    to="/my-orders"
                    className="block px-4 py-2 hover:bg-gray-800"
                  >
                    My Orders
                  </MotionLink>

                  <motion.button
                    {...tapHover}
                    onClick={() => {
                      dispatch(logout());
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/40"
                  >
                    Logout
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </nav>

        <MotionLink
          {...tapHover}
          to="/cart"
          className="lg:hidden relative border border-gray-700 px-3 py-1 rounded-full"
        >
          ??

          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {totalQty}
            </span>
          )}
        </MotionLink>
      </div>

      {mobileMenu && (
        <div className="lg:hidden px-6 pb-4 space-y-3 border-t border-gray-800">
          {isAuthenticated && (
            <div className="pb-2 border-b border-gray-800 text-gray-200">
              Logged in as <span className="font-semibold">{user?.name}</span>
            </div>
          )}

          {isAdmin && (
            <motion.button
              {...tapHover}
              onClick={() => navigate("/admin")}
              className="block text-indigo-400"
            >
              Admin Panel
            </motion.button>
          )}

          {isAuthenticated && (
            <MotionLink {...tapHover} to="/checkout" className="block text-gray-300">
              Quick Checkout
            </MotionLink>
          )}

          {!isAuthenticated ? (
            <MotionLink {...tapHover} to="/login" className="block text-yellow-400">
              Login
            </MotionLink>
          ) : (
            <>
              <MotionLink {...tapHover} to="/profile" className="block text-gray-300">
                My Profile
              </MotionLink>

              <MotionLink {...tapHover} to="/my-orders" className="block text-gray-300">
                My Orders
              </MotionLink>

              <motion.button
                {...tapHover}
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="text-red-400"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
