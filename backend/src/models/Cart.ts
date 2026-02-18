import { Schema} from "mongoose";
import type { InferSchemaType, HydratedDocument } from "mongoose";
import mongoose from "mongoose";


//Schema
const cartSchema = new Schema({
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

// to automatically infer types
export type Cart = InferSchemaType<typeof cartSchema>

// mongoosse model
export type CartDocument = HydratedDocument<Cart>;


const CartModel =
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default CartModel;
