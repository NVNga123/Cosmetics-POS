import axios from "axios";
import type { Product } from "../types/product";

const API_URL = "http://localhost:8085/products";


export const productApi = {
  //Lấy toàn bộ sản phẩm
  getAllProducts: async (): Promise<any> => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  
  //Lấy sản phẩm theo category
  getProductsByCate: async (category : string): Promise<any> => {
    const response = await axios.get(`${API_URL}?category=${category}`);
    return response.data;
  },
  
  // Lấy sản phẩm theo trang
  getProducts: async (page: number, category: string, name: string, brand: string): Promise<any> => {
    const response = await axios.get(`${API_URL}?page=${page}&size=8&category=${category}&name=${name}&brand=${brand}`);
    return response.data;
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (name: string): Promise<any> => {
    try {
      const response = await axios.get(`${API_URL}?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getById: async (id: string): Promise<Product> => {
    try {
      const response = await axios.get<Product>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo sản phẩm mới
  create: async (product: Product): Promise<Product> => {
    try {
      const response = await axios.post<Product>(API_URL, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật sản phẩm
  update: async (id: string, product: Product): Promise<Product> => {
    try {
      const response = await axios.put<Product>(`${API_URL}/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa sản phẩm
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      throw error;
    }
  },
};
