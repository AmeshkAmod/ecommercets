import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, type PersistConfig} from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./slice/cartSlice";
import productReducer from "./slice/productSlice";
import authReducer from "./slice/authSlice";
import adminOrderReducer from "./slice/adminOrderSlice";
import adminProductReducer from "./slice/adminProductSlice";

import { attachAuthInterceptor } from "../api/api";

/* ---------- FIX STORAGE (VITE ESM ISSUE) ---------- */

/* ---------- ROOT REDUCER ---------- */
const rootReducer = combineReducers({
  cart: cartReducer,
  product: productReducer,
  auth: authReducer,
  adminOrders: adminOrderReducer,
  adminProducts: adminProductReducer,
});

/* ---------- ROOT STATE TYPE ---------- */
export type RootState = ReturnType<typeof rootReducer>;

/* ---------- PERSIST CONFIG ---------- */
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage, // ✅ now has getItem/setItem/removeItem
  whitelist: ["auth", "cart"],
};

/* ---------- PERSISTED REDUCER ---------- */
const persistedReducer = persistReducer<RootState>(
  persistConfig, 
  rootReducer
);

/* ---------- STORE ---------- */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

/* --------TYPES------------- */
export type AppDispatch = typeof store.dispatch;

/* ---------- PERSISTOR ---------- */
export const persistor = persistStore(store);

/* ---------- AXIOS INTERCEPTOR ---------- */
attachAuthInterceptor(() => {
  const state = store.getState();
  return state.auth.user?.token ?? null;
});

