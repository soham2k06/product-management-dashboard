import apiClient from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/constants";
import { Product, ProductsListResponse, CreateProductPayload } from "@/types";
import { unstable_cache } from "@/lib/unstable_cache";

export const productService = {
  getProducts: async ({
    search,
    limit,
    skip = 0,
    select,
  }: {
    limit?: number;
    skip?: number;
    search?: string;
    select?: string;
  }) =>
    unstable_cache(
      async (): Promise<ProductsListResponse> => {
        const baseUrl = search
          ? API_ENDPOINTS.PRODUCTS.SEARCH
          : API_ENDPOINTS.PRODUCTS.LIST;

        const params = new URLSearchParams({});

        if (limit) params.append("limit", limit.toString());
        if (skip) params.append("skip", skip.toString());
        if (search) params.append("q", search);
        if (select) params.append("select", select); // e.g. "id,title,price"

        const response = await apiClient.get<ProductsListResponse>(
          `${baseUrl}?${params.toString()}`,
        );

        return response.data;
      },
      ["products", search || "", String(limit), String(skip), select || ""],
      { revalidate: 60 },
    )(),

  getProductsByCategory: (
    category: string,
    limit: number = 10,
    skip: number = 0,
  ) =>
    unstable_cache(
      async () => {
        const response = await apiClient.get<ProductsListResponse>(
          `${API_ENDPOINTS.PRODUCTS.CATEGORY}/${category}?limit=${limit}&skip=${skip}`,
        );
        return response.data;
      },
      ["products-by-category", category, String(limit), String(skip)],
      { revalidate: 60 },
    )(),

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

  getProduct: (id: number) =>
    unstable_cache(
      async (): Promise<Product> => {
        const response = await apiClient.get<Product>(
          `${API_ENDPOINTS.PRODUCTS.DETAIL}/${id}`,
        );
        return response.data;
      },
      ["product-detail", String(id)],
      { revalidate: 60 * 60 },
    )(),

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
