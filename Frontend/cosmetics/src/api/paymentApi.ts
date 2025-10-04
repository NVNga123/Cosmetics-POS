import axios from "axios";
import type { MomoPaymentRequest } from "../types/payment";

const API_URL = "http://localhost:8086/momo-payment";

export const createMomoPayment = async (momoPaymentRequest: MomoPaymentRequest): Promise<void> => {
    const { data } = await axios.post(API_URL, momoPaymentRequest);

    if (data?.payUrl) window.location.href = data.payUrl;
    else console.error("Không tìm thấy payUrl trong phản hồi:", data);
};
