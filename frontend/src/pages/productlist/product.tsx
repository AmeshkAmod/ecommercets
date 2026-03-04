import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { motion } from "framer-motion";

import Navbar from "../../components/Navbar";
import ProductImages from "../../components/ProductImages";
import ProductInfo from "../../components/ProductInfo";
import BuyBox from "../../components/BuyBox";
import ProductReviews from "../../components/ProductReviews";

import { fetchProductById } from "../../store/slice/productSlice";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.product.products.find(
      (p) => String(p._id) === id
    )
  );

  useEffect(() => {
    if (!id) return;
    if (!product) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, product]);

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen bg-[#020617]">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative p-6 bg-[#020617] min-h-screen text-gray-200 overflow-hidden"
      >

        {/* BACKGROUND GLOW */}
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

        {/* Breadcrumb */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs text-gray-400 mb-4"
        >
          <span className="text-yellow-400 cursor-pointer">
            Home
          </span>{" "}
          › {product.category || "Product"}
        </motion.div>

        {/* PRODUCT LAYOUT */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-1 lg:grid-cols-[2fr_3fr_2fr] gap-6"
        >

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 }
            }}
          >
            <ProductImages product={product} />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 40 },
              show: { opacity: 1, x: 0 }
            }}
          >
            <ProductInfo product={product} />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 40 },
              show: { opacity: 1, x: 0 }
            }}
            whileHover={{ scale: 1.03 }}
            className="transition"
          >
            <BuyBox product={product} />
          </motion.div>

        </motion.section>

        {/* DESCRIPTION */}
        {product.description && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-black border border-gray-800 p-6 rounded"
          >
            <h2 className="text-lg font-semibold mb-3">
              Product Description
            </h2>

            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </motion.section>
        )}

        {/* REVIEWS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ProductReviews product={product} />
        </motion.div>

      </motion.main>
    </>
  );
}