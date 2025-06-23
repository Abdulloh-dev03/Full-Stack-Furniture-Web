import type { Product } from "./productType";
import { axiosInstance } from "../api/axiosInstance";

export const fetchProductsItemsApi = async (): Promise<Product[]> => {
  const response = await axiosInstance.get(`/products/getall`);
  return response.data.data; // ✅ no longer response.data.data.data
};

export const fetchProductsItemsByIdApi = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get(`/products/get/${id}`);
  return response.data.data;
};

export const createProductAPI = async (product: Product): Promise<Product> => {
  const response = await axiosInstance.post("/products/create", product);
  return response.data.data; // ✅
};

export const editProductApi = async (id: number, formData: FormData): Promise<Product> => {
  const response = await axiosInstance.put(`products/edit/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.data;
};

export const deleteProductApi = async (id: number): Promise<number> => {
  await axiosInstance.delete(`/products/delete/${id}`);
  return id; // ✅ Return the deleted ID
};
