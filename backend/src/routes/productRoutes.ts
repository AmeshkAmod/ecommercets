import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
} from "../controllers/productController.ts";

import { protect } from "../middleware/auth.js";
import { requirePermissions } from "../middleware/rbac.js";
import { PermissionKeys } from "../types/rbacTypes.js";

/* ✅ IMPORT UPLOAD MIDDLEWARE */
import upload from "../middleware/upload.ts";

const router = express.Router();

/* ---------- PUBLIC ROUTES ---------- */

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post(
  "/:id/reviews",
  protect,
  addProductReview
);

/* ---------- ADMIN / RBAC ROUTES ---------- */

/* ✅ CREATE PRODUCT WITH IMAGE */
router.post(
  "/",
  protect,
  requirePermissions(PermissionKeys.CREATE_PRODUCT),
  upload.single("image"),   // ⭐ IMAGE UPLOAD
  createProduct
);

/* ✅ UPDATE PRODUCT (OPTIONAL IMAGE UPDATE) */
router.put(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.UPDATE_PRODUCT),
  upload.single("image"),   // ⭐ allow image update
  updateProduct
);

/* DELETE PRODUCT */
router.delete(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.DELETE_PRODUCT),
  deleteProduct
);

export default router;