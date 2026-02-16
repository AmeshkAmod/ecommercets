import type { Request, Response } from "express";
import type { Types } from "mongoose";
import Product from "../models/Product.js";

interface ProductQuery {
  q?: string;
}

interface ReviewBody {
  rating: number;
  comment: string;
}

interface ProductReview {
  user: Types.ObjectId;
  rating: number;
}

export const listProducts = async (
  req: Request,
  res: Response,
) => {
  const query = req.query as ProductQuery;
  const q = typeof query.q === "string" ? query.q : "";
  const products = await Product.find({
    title: { $regex: q, $options: "i" },
  }).limit(50);
  return res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(product);
};

export const createProduct = async (
  req: Request,
  res: Response,
) => {
  const product = await Product.create(req.body as Record<string, unknown>);
  return res.json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body as Record<string, unknown>, {
    new: true,
  });
  return res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  return res.json({ message: "Deleted" });
};

export const addProductReview = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const productId = req.params.id;
    const { rating, comment } = req.body as ReviewBody;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = product.reviews as unknown as ProductReview[];
    const alreadyReviewed = reviews.find(
      (review: ProductReview) => review.user.toString() === req.user?._id.toString(),
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const review = {
      user: req.user._id,
      name: req.user.name || req.user.email,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      reviews.reduce((sum: number, item: ProductReview) => sum + item.rating, 0) /
      product.numReviews;

    await product.save();
    return res.status(201).json({ message: "Review added", product });
  } catch (err: unknown) {
    console.error("Add review error:", err);
    return res.status(500).json({ message: "Failed to add review" });
  }
};
