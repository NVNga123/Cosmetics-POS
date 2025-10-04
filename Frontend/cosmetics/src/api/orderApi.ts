import axios from "axios";
import type {Order, OrderSubmitData} from "../types/order";

const API_URL = "http://localhost:8084/api/orders";

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
    } catch (error: any) {
      console.error('Error submitting order:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Lấy danh sách đơn hàng
  getAllOrders: async (): Promise<Order[]> => {
    try {
      console.log('Fetching orders from:', API_URL);
      const response = await axios.get<Order[]>(API_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Orders fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Lấy đơn hàng theo ID
  getById: async (id: string): Promise<Order> => {
    const response = await axios.get<Order>(`${API_URL}/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderData: OrderSubmitData): Promise<any> => {
    try {
      console.log('Updating order status:', API_URL);

      const response = await axios.put(
          `${API_URL}/${orderData.id}`,
          orderData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      console.log('Order status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng đơn giản
  updateOrderStatusSimple: async (orderId: string, status: string): Promise<any> => {
    try {
      console.log('Updating order status:', orderId, status);
        
      // Tạo orderData với chỉ trạng thái để cập nhật
      const orderData = {
        id: parseInt(orderId),
        status: status,
        items: [], // Empty array vì chỉ cập nhật status
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        customerName: '',
        notes: ''
      };
      
      const response = await axios.put(`${API_URL}/${orderId}`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Order status updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating order status:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId: string): Promise<any> => {
    try {
      console.log('Deleting order:', orderId);
      
      const response = await axios.delete(`${API_URL}/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Order deleted successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting order:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },
};