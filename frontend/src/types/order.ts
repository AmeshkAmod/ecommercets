import type { CartItem } from "./cart";

export interface Order {
    _id: string;
    user: string;
    orderItems: CartItem[];
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
}