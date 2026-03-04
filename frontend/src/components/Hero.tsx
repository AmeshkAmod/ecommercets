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
    <section className="relative mb-8 rounded-xl overflow-hidden border border-slate-800
    bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#020617]">

      {/* glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-yellow-400/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 px-6 py-7 md:px-8 md:py-8 max-w-3xl">

        {/* greeting */}
        <p className="text-xs text-slate-400 mb-1">
          {greeting} 👋
        </p>

        {/* badge */}
        <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full
        bg-slate-900 border border-slate-700 text-slate-300 mb-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
          Handpicked deals
        </span>

        {/* title */}
        <h1 className="text-xl md:text-2xl font-semibold text-white leading-snug">
          Discover premium shopping with
          <span className="text-yellow-400"> Dark.Cart</span>
        </h1>

        {/* subtitle */}
        <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-xl">
          Smarter deals, faster checkout and exclusive daily offers.
        </p>

        {/* categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-3 py-1 text-[11px] rounded-full
              bg-slate-900 border border-slate-700 text-slate-300
              hover:border-yellow-400 hover:text-yellow-400 transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3 mt-5">
          <button
            className="bg-yellow-400 text-black px-5 py-2 rounded-full text-xs font-semibold
            hover:brightness-110 transition"
          >
            Shop Now
          </button>

          <button
            className="border border-slate-700 text-slate-200 px-5 py-2 rounded-full text-xs
            hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            View Deals
          </button>
        </div>

        {/* TRUST BADGES */}
        <div className="flex flex-wrap gap-5 mt-4 text-[11px] text-slate-400">
          <span>🔒 Secure checkout</span>
          <span>↩️ Easy returns</span>
          <span>⭐ 100k+ happy customers</span>
        </div>

      </div>
    </section>
  );
}