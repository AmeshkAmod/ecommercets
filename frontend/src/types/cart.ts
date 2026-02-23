import type { Product } from "./product";

export interface CartItem {
    porduct: Product;
    quantity: number;
}