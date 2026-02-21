export default function Hero() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <section className="relative mb-8 rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-r from-[#18181b] via-[#1f1f2e] to-[#18181b]">

      {/* Glow effects */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-fuchsia-500/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-yellow-400/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 px-6 py-6 md:px-8 md:py-7 max-w-3xl">

        {/* Greeting */}
        <p className="text-xs text-gray-400 mb-1">
          {greeting} 👋
        </p>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 text-[11px] px-3 py-1 rounded-full bg-black/40 border border-slate-600 text-gray-300 mb-3">
          <span className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></span>
          Handpicked deals for you
        </span>

        {/* Heading */}
        <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
          Discover premium shopping with{" "}
          <span className="text-yellow-400">dark.cart</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-xl">
          Smarter deals, faster checkout, and a seamless shopping experience.
        </p>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
          {["Electronics", "Fashion", "Home", "Beauty", "Accessories"].map(
            (cat) => (
              <button
                key={cat}
                className="px-3 py-1 rounded-full bg-black/40 border border-slate-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 transition"
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Mini Offers (Auto slide look) */}
        <div className="mt-5 flex gap-3 text-[11px] text-gray-300 overflow-hidden">
          <div className="px-3 py-1.5 rounded-full bg-black/40 border border-slate-600 animate-pulse">
            ⚡ Up to 40% off
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/40 border border-slate-600">
            🚚 Free delivery today
          </div>
          <div className="px-3 py-1.5 rounded-full bg-black/40 border border-slate-600">
            💳 No-cost EMI
          </div>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap gap-4 mt-5 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            🔒 Secure checkout
          </span>
          <span className="flex items-center gap-1">
            ↩️ Easy returns
          </span>
          <span className="flex items-center gap-1">
            ⭐ 10k+ happy customers
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-6">
          <button className="bg-yellow-400 text-black px-5 py-2 rounded-full text-xs font-semibold hover:brightness-110 transition">
            Shop now
          </button>

          <button className="border border-slate-600 text-gray-200 px-5 py-2 rounded-full text-xs hover:border-yellow-400 hover:text-yellow-400 transition">
            View deals
          </button>
        </div>
      </div>
    </section>
  );
}
