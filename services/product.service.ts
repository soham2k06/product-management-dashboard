import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import {
  Product,
  ProductsListResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/types";
import { unstable_cache } from "@/lib/unstable_cache";

export const productService = {
  getProducts: unstable_cache(
    async (
      search: string,
      limit: number = 10,
      skip: number = 0,
    ): Promise<ProductsListResponse> => {
      const response = await apiClient.get<ProductsListResponse>(
        `${search ? API_ENDPOINTS.PRODUCTS.SEARCH : API_ENDPOINTS.PRODUCTS.LIST}?limit=${limit}&skip=${skip}&search=${encodeURIComponent(search)}`,
      );
      return response.data;
    },
    ["products"],
    { revalidate: 60 * 60 }, // Cache for 1 hour
  ),

  getProductsByCategory: unstable_cache(
    async (
      category: string,
      limit: number = 10,
      skip: number = 0,
    ): Promise<ProductsListResponse> => {
      const response = await apiClient.get<ProductsListResponse>(
        `${API_ENDPOINTS.PRODUCTS.CATEGORY}/${category}?limit=${limit}&skip=${skip}`,
      );
      return response.data;
    },
    ["products-by-category"],
    { revalidate: 60 },
  ),

  getCategories: unstable_cache(
    async (): Promise<string[]> => {
      const response = await apiClient.get<string[]>(
        API_ENDPOINTS.PRODUCTS.CATEGORIES,
      );
      return response.data;
    },
    ["product-categories"],
    { revalidate: 60 * 60 * 24 }, // Cache for 24 hours
  ),

  getProduct: unstable_cache(
    async (id: number): Promise<Product> => {
      const response = await apiClient.get<Product>(
        `${API_ENDPOINTS.PRODUCTS.DETAIL}/${id}`,
      );
      return response.data;
    },
    ["product-detail"],
    { revalidate: 60 * 60 },
  ),

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
