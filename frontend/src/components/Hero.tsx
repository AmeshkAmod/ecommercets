import { motion } from "framer-motion";

export default function Hero() {
  const hour: number = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  const categories: string[] = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Accessories",
  ];

  return (
    <section
      className="relative mb-8 rounded-xl overflow-hidden border border-slate-800
      bg-linear-to-r from-[#020617] via-[#0f172a] to-[#020617]"
    >
      {/* Animated Glow */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-24 -right-24 w-60 h-60 bg-yellow-400/10 blur-3xl rounded-full"
      />

      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full"
      />

      <div className="relative z-10 px-6 py-7 md:px-8 md:py-8 max-w-3xl">
        
        {/* Greeting */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs text-slate-400 mb-1"
        >
          {greeting} 👋
        </motion.p>

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full
          bg-slate-900 border border-slate-700 text-slate-300 mb-2"
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          Handpicked deals
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-semibold text-white leading-snug"
        >
          Discover premium shopping with
          <span className="text-yellow-400"> Dark.Cart</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl"
        >
          Smarter deals, faster checkout and exclusive daily offers.
        </motion.p>

        {/* Categories */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="flex flex-wrap gap-2 mt-4"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 text-[11px] rounded-full
              bg-slate-900 border border-slate-700 text-slate-300
              hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-5">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black px-5 py-2 rounded-full text-xs font-semibold
            hover:brightness-110 transition"
          >
            Shop Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="border border-slate-700 text-slate-200 px-5 py-2 rounded-full text-xs
            hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            View Deals
          </motion.button>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-5 mt-4 text-[11px] text-slate-400"
        >
          <span>🔒 Secure checkout</span>
          <span>↩️ Easy returns</span>
          <span>⭐ 100k+ happy customers</span>
        </motion.div>

      </div>
    </section>
  );
}