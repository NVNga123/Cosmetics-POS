import axios from "axios";
import type { Order, OrderSubmitData } from "../types/order";

const API_URL = "http://localhost:8084/api/orders";

export const orderApi = {

  submitOrder: async (orderData: OrderSubmitData): Promise<any> => {
    const response = await axios.post(API_URL, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/${id}`);
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
    const response = await axios.put(`${API_URL}/${orderId}`, orderData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  deleteOrder: async (orderId: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}/${orderId}`);
    return response.data;
  },
};
