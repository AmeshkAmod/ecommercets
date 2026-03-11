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

/* ✅ IMPORT UPLOAD MIDDLEWARE */
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/* ---------- PUBLIC ROUTES ---------- */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 */

router.get("/", listProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     description: Retrieve product details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProduct);

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Add product review
 *     tags: [Products]
 *     description: Authenticated users can add a review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 */
router.post(
  "/:id/reviews",
  protect,
  addProductReview
);

/* ---------- ADMIN / RBAC ROUTES ---------- */


/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product
 *     tags: [Products]
 *     description: Admin can create a new product with images
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/",
  protect,
  requirePermissions(PermissionKeys.CREATE_PRODUCT),
  upload.array("images", 5),   
  createProduct
);

/* ✅ UPDATE PRODUCT (OPTIONAL IMAGE UPDATE) */
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     description: Admin updates product information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.UPDATE_PRODUCT),
  upload.array("images", 5),   //  allow image update
  updateProduct
);

/* DELETE PRODUCT */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     description: Admin deletes a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete(
  "/:id",
  protect,
  requirePermissions(PermissionKeys.DELETE_PRODUCT),
  deleteProduct
);

export default router;