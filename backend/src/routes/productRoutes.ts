import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
} from "../controllers/productController.js";

import { protect } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/rbac.js";

const router = express.Router();

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/:id/reviews", protect, addProductReview);

// Protected + RBAC routes
router.post("/", protect, requirePermissions("product.create"), createProduct);

router.put(
  "/:id",
  protect,
  requirePermissions("product.update"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  requirePermissions("product.delete"),
  deleteProduct
);

export default router;
