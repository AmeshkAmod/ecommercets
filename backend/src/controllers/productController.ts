import { Request, Response } from "express";
import * as productService from "../services/productService.js";
import { CreateProductDTO } from "../types/productTypes.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";


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
  res: Response
) => {
  try {
    const product = await productService.getProductById(
      req.params.id
    );

    res.json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

/* =========================
   CREATE PRODUCT (✅ IMAGE SUPPORT)
========================= */
export const createProduct = async (
  req: Request<{ id: string }, {}, CreateProductDTO>,
  res: Response
) => {
  try {
    let image: string | undefined;

    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer);
    }

    const product = await productService.createProduct({
      ...req.body,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

/* =========================
   UPDATE PRODUCT (✅ IMAGE UPDATE)
========================= */
export const updateProduct = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    let image: string | undefined;

    if (req.file) {
      console.log("uploading image to cloudinary");
      image = await uploadToCloudinary(req.file.buffer);
      console.log("CLOUDINARY URL", image);
    }

    console.log("Image url", image);

    const product = await productService.updateProduct(
      req.params.id,
      {
        ...req.body,
        ...(image && { image }),
      }
    );

    res.json(product);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
  console.log("FILE:", req.file);
  console.log("BODY", req.body);
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response
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
  res: Response
) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const userId = req.user!._id;
    const userName =
      req.user!.name ?? req.user!.email;

    const product =
      await productService.addProductReview(
        productId,
        userId,
        userName,
        Number(rating),
        comment
      );

    res.status(201).json({
      message: "Review added",
      product,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};