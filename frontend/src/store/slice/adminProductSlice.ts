import type { Product } from "../../types/product";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

interface AdminProductState {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AdminProductState = {
  products: [],
  status: "idle",
  error: null,
}

export const fetchProducts = createAsyncThunk<Product[]>(
  "adminProducts/fetch",
  async () => {
    const res = await API.get<Product[]>("/products");
    return res.data;
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; formData: FormData }
>(
  "adminProducts/update",
  async ({ id, formData }) => {
    const res = await API.put<Product>(
      `/products/${id}`,
      formData,
      
    );

    return res.data;
  }
);
export const deleteProduct = createAsyncThunk<
  string,
  string
>(
  "adminProducts/delete",
  async (id) => {
    await API.delete(`/products/${id}`);
    return id;
  }
);

export const addProduct = createAsyncThunk<
  Product,
  FormData
>(
  "adminProducts/add",
  async (formData) => {
    const res = await API.post<Product>(
      "/products",
      formData,

    );

    return res.data;
  }
);

const slice = createSlice({
  name: "addProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
    /* fetch */
      .addCase(fetchProducts.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.products = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || "Failed to fetch products";
      })

      /* Delete */
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.products = s.products.filter(
          (p) => p._id !== a.payload);
      })
      /* Update or edit */
      .addCase(updateProduct.fulfilled, (s, a) => {
        const index = s.products.findIndex(
          (p) => p._id === a.payload._id
        );
        if (index !== -1) {
          s.products[index] = a.payload;
        }
      })
      /* add product */
      .addCase(addProduct.fulfilled, (s, a) => {
        s.products.unshift(a.payload);
      });
  },
});

export default slice.reducer;
