import mongoose, { Schema } from "mongoose";
import type { InferSchemaType, HydratedDocument, Types } from "mongoose";

/* =========================
   REVIEW SCHEMA
========================= */
const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Infer Review type
export type Review = InferSchemaType<typeof reviewSchema>;

/* =========================
   PRODUCT SCHEMA
========================= */
const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: String,
    category: String,
    image: String,

    countInStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true },
);

/* =========================
   TYPES
========================= */
export type Product = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<Product>;

/* =========================
   MODEL
========================= */
const ProductModel =
  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);

export default ProductModel;
