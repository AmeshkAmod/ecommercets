import type { Product } from "./product";

export interface CartItem {
  productId: Product;
  quantity: number;
}
