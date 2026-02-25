<<<<<<< Updated upstream
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useSearchParams, Navigate } from "react-router-dom";
import { fetchProducts } from "../../store/slice/productSlice";
=======
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../store/slice/productSlice";
import { Navigate } from "react-router-dom";
>>>>>>> Stashed changes
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import ProductGrid from "../../components/ProductGrid";

export default function Home() {
<<<<<<< Updated upstream
  const dispatch = useAppDispatch();

  const { products, status } = useAppSelector(
    (state) => state.product
  );

  const user = useAppSelector(
    (state) => state.auth.user
  );

=======
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.product);
  const user = useSelector((state) => state.auth.user);

  // read search query from URL
>>>>>>> Stashed changes
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

<<<<<<< Updated upstream
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
  }, [products, query]);
=======
  //redirect to admin after login
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // filter products based on search query
  const filteredProducts = list.filter((p) =>
    p.title.toLowerCase().includes(query)
  );
>>>>>>> Stashed changes

  return (
    <>
      <Navbar />
      <main className="p-6 bg-[#020617] min-h-screen">
        <Hero />

        {status === "loading" && (
          <p className="text-gray-400 mt-6">Loading products…</p>
        )}

<<<<<<< Updated upstream
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
=======
        {status === "succeeded" && (
          filteredProducts.length === 0
            ? <p className="text-gray-400 mt-6">No products found</p>
            : <ProductGrid products={filteredProducts} />
        )}
      </main>
    </>
  );
}
>>>>>>> Stashed changes
