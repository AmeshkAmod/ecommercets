import type { CartItem } from "./cart";

export interface Order {
    _id: string;
    user?: {
        email: string;
    };
    total: number;
    status: string;
    createdAt: string;
}