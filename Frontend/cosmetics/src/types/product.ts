export interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
    stock: number;
}

export interface ProductCardProps {
    product: Product;
    onAddToOrder: (product: Product) => void;
}