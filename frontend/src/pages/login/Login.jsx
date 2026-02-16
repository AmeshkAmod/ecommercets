import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (res.meta.requestStatus === "fulfilled") {
      const user = res.payload;

      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/")
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-black to-[#020617] px-4">
      <div className="relative w-full max-w-sm rounded-3xl p-[1px] bg-gradient-to-br from-yellow-400/30 to-transparent">
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-3xl p-7 text-gray-200 shadow-2xl">

          {/* Logo */}
          <h1 className="text-3xl font-extrabold text-center tracking-wide mb-1">
            Dark<span className="text-yellow-400">.</span>Cart
          </h1>
          <p className="text-center text-xs text-gray-400 mb-6">
            Sign in to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
                           transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400
                           transition"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs text-center">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 bg-yellow-400 text-black py-2.5 rounded-xl font-semibold text-sm
                         hover:brightness-110 transition disabled:opacity-60
                         active:scale-[0.98]"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-400 hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
