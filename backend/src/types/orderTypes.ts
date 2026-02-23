export interface CreateOrderItemDTO {
    productId: string;
    qty: number;
}

export interface CreateOrderDTO {
    items: CreateOrderItemDTO[];
    paymentMethod: string;
}