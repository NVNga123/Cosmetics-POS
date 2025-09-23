import type {Product} from "./product.ts";

export interface OrderItem {
    product: Product;
    quantity: number;
    total: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    customerName: string;
    customerPhone: string;
    notes: string;
}

export interface OrderSummaryProps {
    order: Order;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onCancel: () => void;
}