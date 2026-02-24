export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    rating?: number;
    reviews?: number;
}