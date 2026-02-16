import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

export const fetchProducts = createAsyncThunk(
  "adminProducts/fetch",
  async () => (await API.get("/products")).data
);

export const updateProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, price, countInStock }) => {
    const res = await API.put(`/products/${id}`, {
      price,
      countInStock,
    });
    return res.data; //updated product
  }
);

export const deleteProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id) => {
    await API.delete(`/products/${id}`);
    return id;
  }
);

export const addProduct = createAsyncThunk(
  "adminProducts/add",
  async ({ title, price, countInStock }) => {
    const res = await API.post("/products", {
      title,
      price,countInStock,
    });
    return res.data; // newly created product
  }
);

const slice = createSlice({
  name: "addProducts",
  initialState: { 
    products: [],
    status: "idle",
    error: null, 
  },
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
