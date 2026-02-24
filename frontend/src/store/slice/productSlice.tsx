import type { Product } from "../../types/product";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

interface ProductState {
  products: Product[],
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
}

/* ---------- FETCH ALL PRODUCTS ---------- */
export const fetchProducts = createAsyncThunk<
  Product[]
>(
  "products/fetch", 
  async () => {
  const res = await API.get("/products");
  return res.data;
});

/* ---------- FETCH SINGLE PRODUCT (IMPORTANT) ---------- */
export const fetchProductById = createAsyncThunk<
  Product,
  string
>(
  "product/fetchById",
  async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  }
);

/* ---------- SUBMIT REVIEW ---------- */
export const submitReview = createAsyncThunk<
  Product,
  { productId: string; rating: number; comment: string }
>(
  "product/submitReview",
  async ({ productId, rating, comment }) => {
    const res = await API.post(
      `/products/${productId}/reviews`, {
      rating,
      comment,
    });
    return res.data.product;
  }
);

/* ---------- SLICE ---------- */
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* fetch all */
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products"
      })

      /* fetch by id */
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const exists = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (!exists) {
          state.products.push(action.payload);
        }
      })

      /* submit review */
      .addCase(submitReview.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;
