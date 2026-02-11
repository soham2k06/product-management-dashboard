import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import {
  Product,
  ProductsListResponse,
  CreateProductPayload,
  UpdateProductPayload,
  Category,
} from "@/types";

export const productService = {
  getProducts: async (
    search: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<ProductsListResponse> => {
    const response = await apiClient.get<ProductsListResponse>(
      `${search ? API_ENDPOINTS.PRODUCTS.SEARCH : API_ENDPOINTS.PRODUCTS.LIST}?limit=${limit}&skip=${skip}&search=${encodeURIComponent(search)}`,
    );
    return response.data;
  },

  getProductsByCategory: async (
    category: string,
    limit: number = 10,
    skip: number = 0,
  ): Promise<ProductsListResponse> => {
    const response = await apiClient.get<ProductsListResponse>(
      `${API_ENDPOINTS.PRODUCTS.CATEGORY}/${category}?limit=${limit}&skip=${skip}`,
    );
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
    );
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(
      `${API_ENDPOINTS.PRODUCTS.DETAIL}/${id}`,
    );
    return response.data;
  },

  createProduct: async (data: CreateProductPayload): Promise<Product> => {
    const response = await apiClient.post<Product>(
      API_ENDPOINTS.PRODUCTS.ADD,
      data,
    );
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: Partial<CreateProductPayload>,
  ): Promise<Product> => {
    const response = await apiClient.put<Product>(
      `${API_ENDPOINTS.PRODUCTS.UPDATE}/${id}`,
      data,
    );
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS.DELETE}/${id}`);
  },
};
