// import type {Product} from "./product.ts";

export interface OrderItem {
    productId: number;
    productName: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface Order {
    orderId: number;
    code: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
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