import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import Navbar from "../../components/Navbar";
import ProductImages from "../../components/ProductImages";
import ProductInfo from "../../components/ProductInfo";
import BuyBox from "../../components/BuyBox";
import ProductReviews from "../../components/ProductReviews";

import { fetchProductById } from "../../store/slice/productSlice";

export default function Product() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  // ✅ FIRST: read from Redux
  const product = useAppSelector((state) =>
    state.product.products.find((p) => String(p._id) === id)
  );

  // ✅ THEN: fetch if missing (reload / direct URL)
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
        <div className="text-white p-6">Loading product…</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="p-6 bg-[#020617] min-h-screen text-gray-200">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span className="text-yellow-400 cursor-pointer">Home</span> ›{" "}
          {product.category || "Product"}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[2fr_3fr_2fr] gap-6">
          <ProductImages product={product} />
          <ProductInfo product={product} />
          <BuyBox product={product} />
        </section>

        <ProductReviews product={product} />
      </main>
    </>
  );
}
