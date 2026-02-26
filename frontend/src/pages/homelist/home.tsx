import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSearchParams, Navigate } from "react-router-dom";
import { fetchProducts } from "../../store/slice/productSlice";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ProductGrid from "../../components/ProductGrid";

export default function Home() {
  const dispatch = useAppDispatch();

  const { products, status } = useAppSelector(
    (state) => state.product
  );

  const user = useAppSelector(
    (state) => state.auth.user
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
      <main className="p-6 bg-[#020617] min-h-screen">
        <Hero />

        {status === "loading" && (
          <p className="text-gray-400 mt-6">Loading products…</p>
        )}

        {status === "succeeded" &&
          (filteredProducts.length === 0 ? (
            <p className="text-gray-400 mt-6">
              No products found
            </p>
          ) : (
            <ProductGrid products={filteredProducts} />
          ))}
      </main>
    </>
  );
}