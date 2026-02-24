import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Order } from "../../types/order";
import API from "../../api/api"

interface adminOrderState {
  order: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: adminOrderState = {
  order: [],
  status: "idle",
  error: null,
};

export const fetchAllOrders = createAsyncThunk<Order[]>(
  "adminOrders/fetch",
  async () => {
    const res = await API.get("/orders");
    return res.data;
  }
);

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: string }
>(
  "adminOrders/updateStatus",
  async ({ orderId, status }) => {
    const res = await API.put(`/orders/${orderId}`, { status });
    return res.data;
  }
);

const slice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
    })
    .addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.order = action.payload;
    })
    .addCase(fetchAllOrders.rejected, (state, action) => {
      state.status = "failed";
      state.error = 
        typeof action.payload === "string"
        ? action.payload : "Error failed to fetch orders ";
    })
    .addCase(updateOrderStatus.fulfilled, (state, action) => {
      const index = state.order.findIndex(
        (o) => o._id === action.payload._id
      );
      if (index !== -1) {
        state.order[index] = action.payload;
      }
    });
  },
});

export default slice.reducer;
