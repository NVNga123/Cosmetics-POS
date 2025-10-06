import axios from "axios";
import type { Order, OrderSubmitData } from "../types/order";
import { API_URL, API_ORDER } from "../constants/api.constants.ts";

export const orderApi = {

  submitOrder: async (orderData: OrderSubmitData): Promise<any> => {
    const response = await axios.post(API_URL + API_ORDER, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await axios.get<Order[]>(API_URL + API_ORDER);
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}${API_ORDER}/${id}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<any> => {
    const orderData = {
      id: Number(orderId),
      status,
      items: [],
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      customerName: "",
      notes: "",
    };
    const response = await axios.put(`${API_URL}${API_ORDER}/${orderId}`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  deleteOrder: async (orderId: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}${API_ORDER}/${orderId}`);
    return response.data;
  },
};
