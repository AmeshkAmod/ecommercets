export interface Review {
    _id?: string;
    user?: string;
    name?: string;
    rating: number;
    comment: string;
    createdAt?: string;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string;
    category: string;
    countInStock: number;
    createdAt: string;
    updatedAt: string;
    numReviews: number;
    rating?: number;
    reviews?: Review[];
}