
export interface Product {
    id: string;
    brand?: string;
    category?: string;
    description?: string;
    discount?: number;
    name: string;
    price: number;
    slug?: string;
    stock?: number;
    image?: string;
}


export interface ProductCardProps {
    product: Product;
    onAddToOrder: (product: Product) => void;
}