import type {Product} from "./product.ts";

export interface OrderItem {
    product: Product;
    quantity: number;
    total: number;
}

export interface Order {
    id: number;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    customerName: string;
    notes: string;
}

export interface OrderSubmitData {
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customerName: string;
  notes: string;
}

export interface OrderSummaryProps {
    order: Order;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onCancel: () => void;
}