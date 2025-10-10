import axios from "axios";
import type { MomoPaymentRequest } from "../types/payment";
import {API_URL, API_MOMO} from "../constants/apiConstants.ts";

export const createMomoPayment = async (momoPaymentRequest: MomoPaymentRequest): Promise<void> => {
    const { data } = await axios.post(API_URL + API_MOMO, momoPaymentRequest);

    if (data?.payUrl) window.location.href = data.payUrl;
    else console.error("Không tìm thấy payUrl trong phản hồi:", data);
};