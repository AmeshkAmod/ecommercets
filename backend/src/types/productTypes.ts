export interface CreateProductDTO {
    title: string;
    price: number;
    description?: string;
    category?: string;
    image?: string;
    countInStock?: number;
}

export interface AddReviewDTO {
    rating: number;
    comment: string;
}