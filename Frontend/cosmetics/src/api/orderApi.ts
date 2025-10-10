import axios from "axios";
import type { Order, OrderSubmitData } from "../types/order";
import type { Result } from "../types/result.ts";
import { API_URL, API_ORDER } from "../constants/apiConstants.ts";

export const orderApi = {

  submitOrder: async (orderData: OrderSubmitData): Promise<Result<Order>> => {
    const response = await axios.post<Result<Order>>(API_URL + API_ORDER, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getAllOrders: async (): Promise<Result<Order[]>> => {
    const response = await axios.get<Result<Order[]>>(API_URL + API_ORDER);
    return response.data;
  },

  getById: async (id: string): Promise<Result<Order>> => {
    const response = await axios.get<Result<Order>>(`${API_URL}${API_ORDER}/${id}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Result<Order>> => {
    const response = await axios.put<Result<Order>>(
        `${API_URL}${API_ORDER}/${orderId}`,
        { id: Number(orderId), status },
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  },

  deleteOrder: async (orderId: string): Promise<Result<null>> => {
    const response = await axios.delete<Result<null>>(`${API_URL}${API_ORDER}/${orderId}`);
    return response.data;
  },
};
