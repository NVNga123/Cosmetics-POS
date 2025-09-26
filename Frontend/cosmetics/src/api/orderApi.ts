import axios from "axios";
import type {Order, OrderSubmitData} from "../types/order";

const API_URL = "http://localhost:8085/api/orders";

export const orderApi = {
  // Gửi đơn hàng lên backend
  submitOrder: async (orderData: OrderSubmitData): Promise<any> => {
    try {
      console.log('Sending order to:', API_URL);
      console.log('Order data:', orderData);
      
      const response = await axios.post(API_URL, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting order:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng
  getAll: async (): Promise<Order[]> => {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
  },

  // Lấy đơn hàng theo ID
  getById: async (id: string): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/${id}`);
    return response.data;
  },
};
