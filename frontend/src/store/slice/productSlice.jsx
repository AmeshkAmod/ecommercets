import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

/* ---------- FETCH ALL PRODUCTS ---------- */
export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await API.get("/products");
  return res.data;
});

/* ---------- FETCH SINGLE PRODUCT (IMPORTANT) ---------- */
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  }
);

/* ---------- SUBMIT REVIEW ---------- */
export const submitReview = createAsyncThunk(
  "product/submitReview",
  async ({ productId, rating, comment }) => {
    const res = await API.post(`/products/${productId}/reviews`, {
      rating,
      comment,
    });
    return res.data.product;
  }
);

/* ---------- SLICE ---------- */
const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* fetch all */
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      /* fetch by id */
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const exists = state.list.find((p) => p._id === action.payload._id);
        if (!exists) {
          state.list.push(action.payload);
        }
      })

      /* submit review */
      .addCase(submitReview.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;
