import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../store/slice/productSlice";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ProductGrid from "../../components/ProductGrid";
import { motion } from "framer-motion";

export default function Home() {
  const dispatch = useAppDispatch();

  const { products, status } = useAppSelector(
    (state) => state.product
  );

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
  }, [products, query]);

  return (
    <>
      <Navbar />

      <main className="relative p-6 bg-[#020617] min-h-screen overflow-hidden">

        {/* FLOATING PARTICLES */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["0%", "100%"], opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity
            }}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        {/* DELIVERY TRUCK */}
        <motion.div
          initial={{ x: "-20%" }}
          animate={{ x: "120%" }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "linear"
          }}
          className="absolute bottom-10 text-4xl scale-x-[-1]"
        >
          🚛
        </motion.div>

        {/* FLOATING ICONS */}
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute left-10 top-32 text-yellow-400 text-5xl opacity-20"
        >
          🛒
        </motion.div>

        <motion.div
          animate={{ y: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute right-16 top-40 text-yellow-400 text-5xl opacity-20"
        >
          📦
        </motion.div>

        {/* GLOW BLOBS */}
        <motion.div
          animate={{ y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-96 h-96 bg-yellow-400/10 blur-3xl rounded-full top-20 left-10"
        />

        <motion.div
          animate={{ y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute w-96 h-96 bg-purple-500/10 blur-3xl rounded-full bottom-10 right-10"
        />

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Hero />
        </motion.div>

        {/* LOADING */}
        {status === "loading" && (
          <div className="flex justify-center mt-10">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {status === "succeeded" &&
          (filteredProducts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 mt-6"
            >
              No products found
            </motion.p>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              <ProductGrid products={filteredProducts} />
            </motion.div>
          ))}
      </main>
    </>
  );
}