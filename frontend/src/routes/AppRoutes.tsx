import { Routes, Route } from "react-router-dom";

import Home from "../pages/homelist/home";
import Product from "../pages/productlist/product";
import Cart from "../pages/cartlist/cart";
import Checkout from "../pages/checkoutlist/Checkout";
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import AdminRoute from "./AdminRoutes";
import AdminDashboard from "../pages/admin/adminDashboard";
import AdminOrders from "../pages/admin/adminOrder";
import AdminProducts from "../pages/admin/adminProducts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Route>
    </Routes>
  );
}
