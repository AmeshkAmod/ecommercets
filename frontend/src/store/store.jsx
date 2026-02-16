import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageModule from "redux-persist/lib/storage";

import cartReducer from "./slice/cartSlice";
import productReducer from "./slice/productSlice";
import authReducer from "./slice/authSlice";
import adminOrderReducer from "./slice/adminOrderSlice";
import adminProductReducer from "./slice/adminProductSlice";

import { attachAuthInterceptor } from "../api/api";

/* ---------- FIX STORAGE (VITE ESM ISSUE) ---------- */
const storage = storageModule.default || storageModule;

/* ---------- ROOT REDUCER ---------- */
const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  auth: authReducer,
  adminOrders: adminOrderReducer,
  adminProducts: adminProductReducer,
});

/* ---------- PERSIST CONFIG ---------- */
const persistConfig = {
  key: "root",
  storage, // ✅ now has getItem/setItem/removeItem
  whitelist: ["auth", "cart"],
};

/* ---------- PERSISTED REDUCER ---------- */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* ---------- STORE ---------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/* ---------- PERSISTOR ---------- */
export const persistor = persistStore(store);

/* ---------- AXIOS INTERCEPTOR ---------- */
attachAuthInterceptor(() => store.getState().auth.token);
