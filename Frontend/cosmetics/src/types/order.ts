// import type {Product} from "./product.ts";

export interface OrderItem {
    productId: string;
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
    productId: string;
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
  status : string;
}

export interface OrderSummaryProps {
    order: Order;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onSaveOrder: () => void;
}