"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/constants";
import { productService } from "@/services/product.service";
import { CreateProductPayload } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useProducts = (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(page, limit),
    queryFn: () => productService.getProducts("", limit, skip),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPayload) =>
      productService.createProduct(data),
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      toast.success("Product created successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Create product error:", error);
      toast.error("Failed to create product");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateProductPayload>;
    }) => productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      queryClient.setQueryData(
        QUERY_KEYS.PRODUCTS.DETAIL(updatedProduct.id),
        updatedProduct,
      );
      toast.success("Product updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Update product error:", error);
      toast.error("Failed to update product");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Delete product error:", error);
      toast.error("Failed to delete product");
    },
  });
};
