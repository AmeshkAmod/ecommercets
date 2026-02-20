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
import { PermissionKeys } from "../types/rbacTypes.js";
const router = express.Router();

// Public routes
router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/:id/reviews", protect, addProductReview);

// Protected + RBAC routes
router.post("/", protect, requirePermissions(PermissionKeys.CREATE_PRODUCT), createProduct);

router.put(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.UPDATE_PRODUCT),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.DELETE_PRODUCT),
  deleteProduct
);

export default router;
