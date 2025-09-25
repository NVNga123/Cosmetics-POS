import axios from "axios";
import type { Product } from "../types/product";

const API_URL = "http://localhost:8084/api/products";

export const productApi = {
    // Lấy tất cả sản phẩm
    getAll: async (): Promise<Product[]> => {
        const response = await axios.get<Product[]>(API_URL);
        return response.data;
    },
};
/*
    // Lấy sản phẩm theo id
    getById: async (id: number): Promise<Product> => {
        const response = await axios.get<Product>(`${API_URL}/${id}`);
        return response.data;
    },

    // Tạo sản phẩm mới
    create: async (product: Omit<Product, "id">): Promise<Product> => {
        const response = await axios.post<Product>(API_URL, product);
        return response.data;
    },

     // Cập nhật sản phẩm
    update: async (id: number, product: Partial<Product>): Promise<Product> => {
        const response = await axios.put<Product>(`${API_URL}/${id}`, product);
        return response.data;
    },

    // Xoá sản phẩm
    delete: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    },
*/
