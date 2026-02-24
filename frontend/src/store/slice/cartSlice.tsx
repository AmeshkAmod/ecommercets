import type { CartItem } from "../../types/cart";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

/* =========================
   FETCH CART
   GET /api/cart
========================= */
export const fetchCart = createAsyncThunk<CartItem[]>(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/cart");
      // backend returns { userId, items }
      return res.data.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch cart"
      );
    }
  }
);

/* =========================
   ADD TO CART
   POST /api/cart/add
========================= */
export const addToCart = createAsyncThunk<
  CartItem[],
  string
>(
  "cart/add",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await API.post("/cart/add", {
        productId,
        quantity: 1,
      });

      // backend returns { cart: { items } }
      return res.data.cart.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Add to cart failed"
      );
    }
  }
);

/* =========================
   UPDATE CART ITEM QUANTITY
   PUT /api/cart/update
========================= */
export const updateCartItem = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number }
>(
  "cart/update",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await API.put("/cart/update", {
        productId,
        quantity,
      });

      // backend returns { cart: { items } }
      return res.data.cart.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Update cart failed"
      );
    }
  }
);

/* =========================
   REMOVE FROM CART
   DELETE /api/cart/remove
========================= */
export const removeFromCart = createAsyncThunk<
  CartItem[],
  string
>(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await API.delete("/cart/remove", {
        data: { productId },
      });

      return res.data.cart.items;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Remove from cart failed"
      );
    }
  }
);

/* =========================
   CART SLICE
========================= */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- FETCH CART ---------- */
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error =
        typeof action.payload === "string"
        ? action.payload : "Fetch failed";
      })

      /* ---------- ADD TO CART ---------- */
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = 
        typeof action.payload === "string"
        ? action.payload : "Add failed";
      })

      /* ---------- UPDATE CART ITEM ---------- */
      .addCase(updateCartItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = 
        typeof action.payload === "string"
        ? action.payload : "Update failed";
      })

      /* ---------- REMOVE FROM CART ---------- */
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = 
        typeof action.payload === "string"
        ? action.payload : "Remove failed";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
