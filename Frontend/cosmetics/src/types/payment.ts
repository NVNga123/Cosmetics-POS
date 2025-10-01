import type { PaymentMethod } from "../constants/payment.constants.ts";

export interface Payment {
    orderInfo: string;
    amount: number;
    method: PaymentMethod;
}

export interface MomoPaymentRequest {
    orderInfo: string;
    amount: number;
}

export interface PaymentResponse {
    payUrl?: string;
}

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderTotal: number;
    orderCode: string;
    onPaymentSuccess: () => void; // Callback khi thanh toán thành công
}