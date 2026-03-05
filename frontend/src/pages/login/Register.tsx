import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { motion } from "framer-motion";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: ""
  });

  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await API.post("/auth/register", form);

      setSuccess(true);

      let timer = 3;

      const interval = setInterval(() => {
        timer--;
        setCountdown(timer);

        if (timer === 0) {
          clearInterval(interval);
          navigate("/login");
        }
      }, 1000);

    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden px-4">

      {/* FLOATING BACKGROUND BLOBS */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full top-10 left-10"
      />

      <motion.div
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-72 h-72 bg-purple-500/10 blur-3xl rounded-full bottom-10 right-10"
      />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full max-w-sm rounded-3xl p-[1px] bg-gradient-to-br from-yellow-400/50 via-yellow-500/20 to-transparent"
      >
        <div className="bg-[#020617]/90 backdrop-blur-xl rounded-3xl p-7 text-gray-200 shadow-2xl">

          {!success ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >

              {/* LOGO */}
              <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-3xl font-extrabold text-center mb-2"
              >
                Dark<span className="text-yellow-400">.</span>Cart
              </motion.h1>

              <p className="text-center text-xs text-gray-400 mb-6">
                Create your account
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                <motion.div variants={item}>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Full name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:border-yellow-400 transition"
                  />
                </motion.div>

                <motion.div variants={item}>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:border-yellow-400 transition"
                  />
                </motion.div>

                <motion.div variants={item}>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Password
                  </label>

                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm
                    focus:outline-none focus:border-yellow-400 transition"
                  />
                </motion.div>

                {error && (
                  <p className="text-red-400 text-xs text-center">
                    {error}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={item}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 text-black py-2.5 rounded-xl font-semibold text-sm"
                >
                  {loading ? "Creating account..." : "Create account"}
                </motion.button>

              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-yellow-400 hover:underline"
                >
                  Sign in
                </Link>
              </p>

            </motion.div>

          ) : (

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-6"
            >

              {/* SUCCESS CIRCLE */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative flex items-center justify-center w-24 h-24 rounded-full
                bg-yellow-400/20 border border-yellow-400"
              >

                <motion.div
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute w-24 h-24 rounded-full border border-yellow-400"
                />

                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="3"
                  className="w-12 h-12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.path d="M5 13l4 4L19 7" />
                </motion.svg>

              </motion.div>

              <h2 className="text-xl font-semibold mt-6">
                Account Created 🎉
              </h2>

              <p className="text-gray-400 text-sm mt-2 text-center">
                Welcome to <span className="text-yellow-400">Dark.Cart</span>
              </p>

              <p className="text-yellow-400 mt-4 text-sm">
                Redirecting to login in {countdown}...
              </p>

            </motion.div>

          )}

        </div>
      </motion.div>
    </div>
  );
}