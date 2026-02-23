import { Request, Response } from "express";
import * as productService from "../services/productService.js";

/* =========================
   LIST PRODUCTS
========================= */
export const listProducts = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || "";

    const products = await productService.listProducts(q);

    res.json(products);
  } catch (error) {
    console.error("List products error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

/* =========================
   GET PRODUCT
========================= */
export const getProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await productService.getProductById(req.params.id);

    res.json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    res.json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await productService.deleteProduct(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

/* =========================
   ADD REVIEW
========================= */
export const addProductReview = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const userId = req.user!._id;
    const userName = req.user!.name ?? req.user!.email;

    const product = await productService.addProductReview(
      productId,
      userId,
      userName,
      Number(rating),
      comment,
    );

    res.status(201).json({
      message: "Review added",
      product,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
