import type {Product} from "./product.ts";

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

export interface OrderItem {
    product: Product
    quantity: number;
    total: number;
    subtotal: number;
}

export interface OrderSubmitData {
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  id ?: number;
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
    orders: Order[];
    activeOrderIndex: number;
    customerName: string;
    notes: string;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onSaveOrder: () => void;
    onCustomerNameChange: (name: string) => void;
    onNotesChange: (notes: string) => void;
    onAddOrder: () => void;
    onSwitchOrder: (index: number) => void;
    onDeleteOrder: (index: number) => void;
}