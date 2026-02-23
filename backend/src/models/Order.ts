import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType, HydratedDocument } from 'mongoose'; 


//schema
const orderSchema = new Schema(
    {
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },

    items: [
        {
            product: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product',
                required: true,
            },
            qty: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        },
    ],
    total: {
        type: Number,
        required: true,
        min: 0,
    },

    paymentMethod: {
        type: String,
        required: true,
    },
    status: {  
        type: String, 
        default: 'Pending' 
    },
}, 
{ timestamps: true });


//infertypes from schema
export type Order = InferSchemaType<typeof orderSchema>;

//mongoose doc type
export type OrderDocument = HydratedDocument<Order>

const OrderModel = 
    mongoose.models.Order || mongoose.model("Order", orderSchema);
    
export default OrderModel;
