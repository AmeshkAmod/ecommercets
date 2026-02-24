export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    countInStock: number;
    rating?: number;
    reviews?: number;
}