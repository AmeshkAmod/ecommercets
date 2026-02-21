import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetch",
  async () => {
    const res = await API.get("/orders");
    return res.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ orderId, status }) => {
    const res = await API.put(`/orders/${orderId}`, { status });
    return res.data;
  }
);

const slice = createSlice({
  name: "adminOrders",
  initialState: { orders: [], status: "idle" },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export default slice.reducer;
