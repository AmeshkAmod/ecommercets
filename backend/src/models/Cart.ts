import { Model, Document, Schema } from "mongoose";
import mongoose from "mongoose";

//Defined the shape
interface cartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

//Defined the full cart doc
export interface cartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: cartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

//Schema
const cartSchema = new Schema<cartDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      }
    }
  ],
}, { timestamps: true });

//MOdel with type safety
const Cart: Model<cartDocument> =
  mongoose.models.Cart || mongoose.model<cartDocument>("Cart", cartSchema);
export default Cart;
