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
        <div className="text-white p-6">
          Loading product…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="p-6 bg-[#020617] min-h-screen text-gray-200">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-4">
          <span className="text-yellow-400 cursor-pointer">
            Home
          </span>{" "}
          › {product.category || "Product"}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[2fr_3fr_2fr] gap-6">
          <ProductImages product={product} />
          <ProductInfo product={product} />
          <BuyBox product={product} />
        </section>

        {/* Description Section */}
        {product.description && (
          <section className="mt-8 bg-black border border-gray-800 p-6 rounded">
            <h2 className="text-lg font-semibold mb-3">
              Product Description
            </h2>
            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>
          </section>
        )}

        <ProductReviews product={product} />
      </main>
    </>
  );
}