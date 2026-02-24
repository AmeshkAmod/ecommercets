// types/order.ts

export interface OrderItem {
  product: string;
  qty: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string | {
    _id: string;
    email: string;
  }
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}