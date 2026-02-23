import ProductModel from "../models/Product.js";
import { Types } from "mongoose";
import { Review } from "../models/Product.js";

/* =========================
   LIST PRODUCTS
========================= */
export const listProducts = async (query: string) => {
  return ProductModel.find({
    title: { $regex: query, $options: "i" },
  }).limit(50);
};

/* =========================
   GET PRODUCT
========================= */
export const getProductById = async (id: string) => {
  const product = await ProductModel.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

/* =========================
   CREATE PRODUCT
========================= */
export const createProduct = async (data: any) => {
  return ProductModel.create(data);
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (
  id: string,
  data: any,
) => {
  const product = await ProductModel.findByIdAndUpdate(
    id,
    data,
    { new: true },
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (id: string) => {
  await ProductModel.findByIdAndDelete(id);
};

/* =========================
   ADD PRODUCT REVIEW
========================= */
export const addProductReview = async (
  productId: string,
  userId: Types.ObjectId,
  userName: string,
  rating: number,
  comment: string,
) => {
  if (!rating || !comment) {
    throw new Error("Rating and comment are required");
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r:Review) => r.user.toString() === userId.toString(),
  );

  if (alreadyReviewed) {
    throw new Error("Product already reviewed");
  }

  const review = {
    user: userId,
    name: userName,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((sum:number, r:Review) => sum + r.rating, 0) /
    product.numReviews;

  await product.save();

  return product;
};