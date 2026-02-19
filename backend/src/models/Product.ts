// models/Product.js
import { Schema, type Model } from "mongoose";
import type { InferSchemaType, HydratedDocument } from "mongoose";
import mongoose from "mongoose";
//Review 
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
  { timestamps: true }
);

// infer types from schema
export type Review = InferSchemaType<typeof reviewSchema>;


{/* Product */}
const productSchema = new Schema(
  {
    // your existing fields:
    title: { 
      type: String, 
      required: true 
    },

    price: { 
      type: Number, 
      required: true 
    },

    description: { 
      type: String 
    },

    category: { 
      type: String 
    },

    image: { 
      type: String 
    },

    countInStock: { 
      type: Number, 
      default: 0,
      min: 0,
    },

    // NEW fields:
    rating: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5,
    },      // average rating

    numReviews: { 
      type: Number, 
      default: 0,
      min:0,
    },  // total reviews

    reviews: [reviewSchema],          // array of review objects
  },
  { timestamps: true }
);

//infer types from schema
export type Product = InferSchemaType<typeof productSchema>;

//mongoose doc type
export type ProductDocument = HydratedDocument<Product>

const ProductModel:Model<Product> = 
  mongoose.models.Product || mongoose.model<Product>("Product", productSchema);
export default ProductModel;
