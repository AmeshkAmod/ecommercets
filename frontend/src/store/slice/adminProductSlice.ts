import type { Product } from "../../types/product";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";
import { data } from "react-router-dom";

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
    const res = await API.get("/products");
    return res.data;
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  {
    id: string
    price: number
    countInStock: number
    description: string
    images: string[]
  }
>(
  "adminProducts/update",
  async ({ id, ...data }) => {
    const res = await API.put(
      `/products/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
  {
    title: string;
    description: string;
    price: number;
    countInStock: number;
    images: string[];
  }
>(
  "adminProducts/add",
  async (data) => {
    const res = await API.post("/products", data);
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
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.products = a.payload;
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
