export interface CreateProductDTO {
    title: string;
    price: number;
    description?: string;
    category?: string;
    images?: string[];
    countInStock?: number;
}

export interface AddReviewDTO {
    rating: number;
    comment: string;
}