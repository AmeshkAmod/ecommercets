import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { PermissionKeys } from "../../types/auth";
import { AuthUser } from "../../types/user";
import { motion } from "framer-motion";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
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
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617]">
      {/* PARTICLES */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ["0%", "100%"], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* DELIVERY ROAD */}
      <div className="absolute bottom-24 w-full h-[2px] bg-gray-700"></div>

      {/* ROAD DASHES */}
      <motion.div
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute bottom-24 w-full h-[2px] border-t border-dashed border-gray-500"
      />
     {/* DELIVERY TRUCK */}


<motion.div
  initial={{ x: "120%" }}   // start off-screen left
  animate={{ x: "-20%" }}   // move to right
  transition={{
    repeat: Infinity,
    duration: 14,
    ease: "linear"
  }}
  className="absolute bottom-20 text-4xl scale-x-[-1]"
>
  🚛
</motion.div>

      {/* FLOATING CART ICONS */}
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-20 top-24 text-yellow-400 text-5xl opacity-20"
      >
        🛒
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute right-24 bottom-32 text-yellow-400 text-6xl opacity-20"
      >
        📦
      </motion.div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-sm rounded-3xl p-px bg-gradient-to-br from-yellow-400/30 to-transparent"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-7 text-gray-200 shadow-2xl">
          {/* LOGO */}
          <motion.h1
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-3xl font-extrabold text-center mb-2"
          >
            Dark<span className="text-yellow-400">.</span>Cart
          </motion.h1>

          <p className="text-center text-xs text-gray-400 mb-6">
            Sign in to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
            </motion.div>

            {/* PASSWORD */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="text-xs text-gray-400 mb-1 block">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-xs text-yellow-400"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </motion.div>

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

            {/* LOGIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={status === "loading"}
              className="w-full mt-2 bg-yellow-400 text-black py-2.5 rounded-xl font-semibold text-sm"
            >
              {status === "loading" ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>

          {/* FOOTER */}
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
      </motion.div>
    </div>
  );
}
