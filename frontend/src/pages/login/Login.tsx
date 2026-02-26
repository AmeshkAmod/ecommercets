import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { PermissionKeys } from "../../types/auth";
import { AuthUser } from "../../types/user";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { status, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      // unwrap gives you typed user directly
      const user = await dispatch(loginUser(form)).unwrap();

      const getpermissions = (user: AuthUser) =>
        user.role.flatMap((r) => r.permissions);

      const permissions = getpermissions(user);

      if (permissions.includes(PermissionKeys.CREATE_PRODUCT)) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      // error already handled in slice
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#020617] via-black to-[#020617] px-4">
      <div className="relative w-full max-w-sm rounded-3xl p-px bg-linear-to-br from-yellow-400/30 to-transparent">
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
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-xs text-yellow-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
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
