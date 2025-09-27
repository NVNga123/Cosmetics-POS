
export interface Product {
    id: string;
    brand: string | null;
    category: string | null;
    description: string | null;
    discount: number | null;
    name: string;
    price: number;
    slug: string | null;
    stock: number | null;
    image: string | null;
}


export interface ProductCardProps {
    product: Product;
    onAddToOrder: (product: Product) => void;
}