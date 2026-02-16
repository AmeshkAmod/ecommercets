import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../store/slice/productSlice";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ProductGrid from "../../components/ProductGrid";

export default function Home() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);

  // read search query from URL
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  //redirect to admin after login
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // filter products based on search query
  const filteredProducts = list.filter((p) =>
    p.title.toLowerCase().includes(query)
  );

  return (
    <>
      <Navbar />
      <main className="p-6 bg-[#020617] min-h-screen">
        <Hero />

        {status === "loading" && (
          <p className="text-gray-400 mt-6">Loading products…</p>
        )}

        {status === "succeeded" && (
          filteredProducts.length === 0
            ? <p className="text-gray-400 mt-6">No products found</p>
            : <ProductGrid products={filteredProducts} />
        )}
      </main>
    </>
  );
}
